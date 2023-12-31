import { createClient } from "@supabase/supabase-js";
import { NextFetchEvent, NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat";
import { PostHog } from "posthog-node";
import { v4 } from "uuid";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { env } from "~/env.mjs";
import { splitOpenaiStream } from "~/lib/openai/streaming";
import { DEFAULT_MEMORY_PROMPT } from "~/lib/prompts/memory";
import { Database } from "~/server/supabase";

const memorySchema = z.array(
  z.object({
    id: z
      .number()
      .describe(
        "The id of the existing memory to edit if you would like to edit an exisitng memory (starting from 1). Omit this field if you are creating a new memory."
      )
      .optional(),
    content: z
      .string()
      .describe(
        "The value of the memory (if id specified this will replace the existing memory), otherwise new memory will be created."
      ),
  })
);

export const config = {
  runtime: "edge",
};

const supabaseClient = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_API_KEY,
  {
    auth: { persistSession: false },
  }
);

export type MemoryDiff = (
  | {
      type: "insert";
      content: string;
    }
  | {
      type: "update";
      content: string;
      replaced: string;
    }
)[];

async function logRequest(
  openai: OpenAI,
  apiKey: string,
  params: OpenAI.Chat.Completions.CompletionCreateParams,
  response: OpenAI.Chat.Completions.ChatCompletion,
  duration: number,
  persist: string | null,
  memories: VectorResponse[] | null,
  headers: Headers
) {
  const user = await supabaseClient
    .from("User")
    .select("*")
    .match({ apiKey: apiKey })
    .single();

  if (!user.data) {
    throw new Error("User not found");
  }

  const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  posthogClient.capture({
    event: "api_call",
    distinctId: user.data.id,
    properties: {
      model: params.model,
      duration,
    },
  });

  if (headers && headers.get("x-gp-short") && persist) {
    const DATE_TIME = new Date().toISOString();
    console.log("Inserting");
    const history = await supabaseClient.from("History").insert([
      {
        id: DATE_TIME + "A",
        role: params.messages.at(-1)?.role as "assistant" | "user",
        content: params.messages.at(-1)?.content ?? "",
        storeId: persist,
        userId: user.data.id,
      },
      {
        id: DATE_TIME + "B",
        role: response.choices[0].message.role as "assistant" | "user",
        content: response.choices[0].message.content!,
        storeId: persist,
        userId: user.data.id,
      },
    ]);
    console.log("Inserting finished ", history);
  }

  await fetch("https://api.us-east.tinybird.co/v0/events?name=llm_call", {
    method: "POST",
    body: JSON.stringify({
      model: params.model,
      timestamp: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
      num_tokens: response.usage?.total_tokens ?? 100,
      price: (response.usage?.total_tokens ?? 100) / 10000,
      user_id: user.data.id,
    }),
    headers: {
      Authorization: `Bearer ${env.TINYBIRD_API_KEY}`,
    },
  });

  let memoryUpdate: MemoryDiff | undefined = undefined;

  if (persist) {
    let history = [
      ...params.messages
        .filter((x) => x.role === "user")
        .map((message) => `${message.content}`),
    ].join("\n");

    let existing = "NO existing memories found.";

    if (memories && memories.length) {
      existing = `\n\nExisting memories that you may choose to modify:\n${memories
        .map((m, idx) => {
          return `${idx + 1}. ${m.content.replace(/\n/g, " ")}`;
        })
        .join("\n")}`;
    }

    const memoryCall = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      temperature: 0.0,
      messages: [
        {
          role: "system",
          content: user.data.memoryPrompt ?? DEFAULT_MEMORY_PROMPT,
        },
        { role: "user", content: "History to generate facts for: " + history },
      ],
      functions: [
        {
          name: "update_memory",
          description: "Always call this function to submit your memories.",
          parameters: zodToJsonSchema(z.object({ memory: memorySchema })),
        },
      ],
    });

    if (memoryCall.choices[0].finish_reason === "function_call") {
      const res = z
        .object({ memory: memorySchema })
        .safeParse(
          JSON.parse(
            memoryCall.choices[0].message.function_call?.arguments ?? ""
          )
        );

      if (res.success) {
        const updates = await Promise.all(
          res.data.memory.map(async (memory) => {
            const embedding = (
              await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: memory.content,
              })
            ).data[0]!.embedding;

            if (memory.id && memory.id > (memories?.length ?? 0))
              memory.id = undefined;

            return {
              content: memory.content,
              id: memory.id,
              userId: user.data.id,
              storeId: persist,
              updatedAt: new Date(Date.now()),
              embedding,
            };
          })
        );

        // insert new memories (without id) with supabase
        const newMemories = updates.filter((memory) => !memory.id);
        const insert = await supabaseClient.from("Memory").insert(
          newMemories.map((m) => {
            return { ...(m as any), id: v4() };
          })
        );

        // update existing memories (with id) with supabase
        const existingMemories = updates.filter((memory) => memory.id);
        await Promise.all(
          existingMemories.map(async (memory) => {
            await supabaseClient
              .from("Memory")
              .update({
                content: memory.content,
                embedding: memory.embedding as any,
                updatedAt: memory.updatedAt as any,
              })
              .match({ id: memories![memory.id! - 1].id });
          })
        );

        memoryUpdate = [
          ...newMemories.map((m) => ({
            type: "insert" as const,
            content: m.content,
          })),
          ...existingMemories.map((m) => ({
            type: "update" as const,
            content: m.content,
            replaced: memories![m.id! - 1].content,
          })),
        ];
      }
    }
  }

  const res = await supabaseClient.from("Request").insert([
    {
      memoryUpdate,
      model: params.model,
      request: params as any,
      response: response as any,
      numTokens: response.usage?.total_tokens ?? 100,
      duration,
      userId: user.data.id,
    },
  ]);

  console.log("Inserted ", JSON.stringify(res));
}

type VectorResponse = {
  id: string;
  content: string;
  similarity: number;
};

function calculateCharacters(messages: ChatCompletionMessage[]): number {
  return messages.reduce(
    (total, message) => total + (message.content ? message.content.length : 0),
    0
  );
}

const MAX_CHARACTERS = 10000;

function handleOverflow(messages: ChatCompletionMessage[]) {
  // Check if the total messages exceed the limit
  while (
    calculateCharacters(messages) > MAX_CHARACTERS &&
    messages.length > 2
  ) {
    messages.splice(1, 1); // Remove the second oldest message, keeping the system message intact
  }

  // Check if any single message exceeds the limit
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.content && message.content.length > MAX_CHARACTERS) {
      // Truncate the message and add an ellipsis
      message.content =
        message.content.substring(0, MAX_CHARACTERS - 3) + "...";
    }
  }
}

export default async function handler(req: NextRequest, event: NextFetchEvent) {
  if (req.method !== "POST")
    return new Response("Method not allowed, use POST", { status: 405 });

  //
  const apiKey = req.headers.get("x-gp-api-key") as string;

  const OPENAI_API_KEY = req.headers
    .get("authorization")!
    .replace("Bearer ", "");

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const params: OpenAI.Chat.Completions.CompletionCreateParams =
    await req.json();

  const context = req.headers.get("x-gp-context");
  const persist = req.headers.get("x-gp-remember");
  let user;

  function prependSystemMessage(prependMessage: string) {
    if (params.messages.some((message) => message.role == "system"))
      params.messages = params.messages.map((message) => {
        if (message.role == "system")
          return {
            ...message,
            content: prependMessage + "\n\nInstructions:\n" + message.content,
          };
        return message;
      });
    else
      params.messages = [
        { role: "system", content: prependMessage },
        ...params.messages,
      ];
  }

  let memories: VectorResponse[] | null = null;

  if (persist) {
    user = await supabaseClient
      .from("User")
      .select("*")
      .match({ apiKey: apiKey })
      .single();

    if (!user.data) {
      throw new Error("User not found");
    }

    if (req.headers.get("x-gp-short")) {
      const history = await supabaseClient
        .from("History")
        .select("*")
        .match({ storeId: persist, userId: user.data.id })
        .order("id", { ascending: true })
        .limit(20);

      if (history.data)
        params.messages = [
          ...params.messages.filter((message) => message.role === "system"),
          ...history.data!.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          ...params.messages.filter((message) => message.role !== "system"),
        ];
    }

    const embedding = (
      await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: params.messages.at(-1)?.content!,
      })
    ).data[0]!.embedding;

    const memReq = await supabaseClient.rpc("match_memories", {
      query_embedding: embedding as any,
      match_threshold: 0.5, // Choose an appropriate threshold for your data
      match_count: 5, // Choose the number of matches
      store_id: persist,
      user_id: user.data.id,
    });

    memories = memReq.data;

    if (memories?.length ?? 0 > 0) {
      prependSystemMessage(
        `Some relevant facts/context from previous interactions:\n${memories
          ?.map(
            (memory, idx) => `${idx + 1}. ${memory.content.replace(/\n/g, " ")}`
          )
          .join("\n")}`
      );
    }
  }

  if (context) {
    const contextData = await supabaseClient
      .from("DocumentContext")
      .select("*")
      .match({
        id: context,
      })
      .single();

    if (!contextData.data) {
      throw new Error("Context not found");
    }

    let prependMessage = contextData.data.context;

    const embedding = (
      await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: params.messages.at(-1)?.content!,
      })
    ).data[0]!.embedding;

    const { data: snippets }: { data: VectorResponse[] | null } =
      await supabaseClient.rpc("match_snippets", {
        query_embedding: embedding as any,
        match_threshold: 0.5, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
        context_id: context,
      });

    const content = snippets
      ?.map(
        (snippet, idx) => `${idx + 1}. ${snippet.content.replace(/\n/g, " ")}`
      )
      .join("\n");
    prependMessage += `\n${contextData.data.name}\n:${content}`;
    prependSystemMessage(prependMessage);
  }

  // handle overflow
  handleOverflow(params.messages);

  if (params.stream) {
    params.temperature = 0; // enforce consistency

    const start = +new Date();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error.message);
    }

    async function logAndWait(x: Promise<ChatCompletion>) {
      const result = await x;
      await logRequest(
        openai,
        apiKey,
        params,
        result,
        +new Date() - start,
        persist,
        memories,
        req.headers
      );
    }

    const [body, ret] = splitOpenaiStream(response.body!);
    event.waitUntil(logAndWait(body));

    return new Response(ret, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } else {
    const start = +new Date();
    const response = await openai.chat.completions.create(
      params as OpenAI.Chat.Completions.CompletionCreateParamsNonStreaming
    );

    event.waitUntil(
      logRequest(
        openai,
        apiKey,
        params,
        response,
        +new Date() - start,
        persist,
        memories,
        req.headers
      )
    );

    return new Response(JSON.stringify(response), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
