import { createClient } from "@supabase/supabase-js";
import { NextFetchEvent, NextRequest } from "next/server";
import OpenAI from "openai";
import { env } from "~/env.mjs";
import { completion } from "zod-gpt";
import { z } from "zod";
import { OpenAIChatApi } from "llm-api";
import { v4 } from "uuid";

const memorySchema = z.array(
  z.object({
    memoryNumber: z
      .number()
      .describe(
        "The number of of the existing memory to edit if you would like to edit an exisitng memory (starting from 1). Omit this field if you are creating a new memory."
      )
      .optional(),
    content: z
      .string()
      .describe(
        "The value of the memory (if memoryNumber specified this will replace the existing memory"
      ),
  })
);

export const config = {
  runtime: "edge",
};

const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY, {
  auth: { persistSession: false },
});

async function logRequest(
  openai: OpenAI,
  apiKey: string,
  params: OpenAI.Chat.Completions.CompletionCreateParams,
  response: OpenAI.Chat.Completions.ChatCompletion,
  duration: number,
  persist: string | null,
  memories: VectorResponse[] | null
) {
  const user = await supabaseClient
    .from("User")
    .select("*")
    .match({ apiKey: apiKey })
    .single();

  await fetch("https://api.us-east.tinybird.co/v0/events?name=llm_call", {
    method: "POST",
    body: JSON.stringify({
      model: params.model,
      timestamp: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
      num_tokens: response.usage!.total_tokens,
      price: response.usage!.total_tokens / 10000,
      user_id: user.data.id,
    }),
    headers: {
      Authorization: `Bearer ${env.TINYBIRD_API_KEY}`,
    },
  });

  const res = await supabaseClient.from("Request").insert([
    {
      model: params.model,
      request: params as any,
      response: response as any,
      numTokens: response.usage!.total_tokens,
      duration,
      userId: user.data.id,
    },
  ]);

  if (persist) {
    const llmVersion = new OpenAIChatApi(
      { apiKey: openai.apiKey },
      { model: "gpt-3.5-turbo-0613" }
    );
    let history = [
      ...params.messages
        .filter((x) => x.role === "assistant" || x.role === "user")
        .map((message) => `${message.role}: ${message.content}`),
      `${response.choices[0].message.role}: ${response.choices[0].message.content}`,
    ].join("\n");

    if (memories && memories.length) {
      history += `\n\nExisting memories that you may choose to modify:\n${memories
        .map((m, idx) => {
          return `${idx + 1}. ${m.content.replace(/\n/g, " ")}`;
        })
        .join("\n")}`;
    } else {
      history += `\n\nNo existing memories found.`;
    }

    const res = await completion(
      llmVersion,
      `Given the following chat history, update or create relevant memories below that could be useful in the future. ${history}. Memories are facts that the user has provided that would be useful to remember for future conversations. Useful facts to remember are the names of people, locations, places. Issues encountered, etc.`,
      {
        schema: z.object({ memory: memorySchema }),
      }
    );

    const updates = await Promise.all(
      res.data.memory.map(async (memory) => {
        const embedding = (
          await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: memory.content,
          })
        ).data[0]!.embedding;

        if (
          memory.memoryNumber &&
          memory.memoryNumber > (memories?.length ?? 0)
        )
          memory.memoryNumber = undefined;

        return {
          content: memory.content,
          id: memory.memoryNumber,
          userId: user.data.id,
          storeId: persist,
          updatedAt: new Date(Date.now()),
          embedding,
        };
      })
    );

    // insert new memories (without memoryNumber) with supabase
    const newMemories = updates.filter((memory) => !memory.id);
    const insert = await supabaseClient.from("Memory").insert(
      newMemories.map((m) => {
        return { ...m, id: v4() };
      })
    );

    console.log("insert", insert);

    // update existing memories (with memoryNumber) with supabase
    const existingMemories = updates.filter((memory) => memory.id);
    await Promise.all(
      existingMemories.map(async (memory) => {
        await supabaseClient
          .from("Memory")
          .update({
            content: memory.content,
            embedding: memory.embedding,
            updatedAt: memory.updatedAt,
          })
          .match({ id: memories![memory.id! - 1].id });
      })
    );
  }
}

type VectorResponse = {
  id: string;
  content: string;
  similarity: number;
};

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

    const embedding = (
      await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: params.messages.at(-1)?.content!,
      })
    ).data[0]!.embedding;

    memories = (
      await supabaseClient.rpc("match_memories", {
        query_embedding: embedding,
        match_threshold: 0, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
        context_id: context,
      })
    ).data;

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

    console.log("Context data: ", contextData);

    let prependMessage = contextData.data.context;

    const embedding = (
      await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: params.messages.at(-1)?.content!,
      })
    ).data[0]!.embedding;

    const { data: snippets }: { data: VectorResponse[] | null } =
      await supabaseClient.rpc("match_snippets", {
        query_embedding: embedding,
        match_threshold: 0, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
        context_id: context,
      });

    const content = snippets
      ?.map(
        (snippet, idx) => `${idx + 1}. ${snippet.content.replace(/\n/g, " ")}`
      )
      .join("\n");
    prependMessage += `\n${content}`;
    prependSystemMessage(prependMessage);
  }

  if (params.stream) {
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

    return new Response(response.body, {
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
        memories
      )
    );

    return new Response(JSON.stringify(response), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
