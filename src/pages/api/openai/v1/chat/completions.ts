import { createClient } from "@supabase/supabase-js";
import { NextFetchEvent, NextRequest } from "next/server";
import OpenAI from "openai";
import { env } from "~/env.mjs";
import { completion } from "zod-gpt";
import { z } from "zod";

const memorySchema = z.array(
  z.union([
    z.object({
      type: z.literal("edit"),
      id: z.string().describe("The ID of the existing memory to edit"),
      content: z.string().describe("The new value of the memory"),
    }),
    z.object({
      type: z.literal("new"),
      content: z.string().describe("The content of the memory"),
    }),
  ])
);

export const config = {
  runtime: "edge",
};

const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY, {
  auth: { persistSession: false },
});

async function logRequest(
  apiKey: string,
  params: OpenAI.Chat.Completions.CompletionCreateParams,
  response: OpenAI.Chat.Completions.ChatCompletion,
  duration: number
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

  console.log(res);
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

  if (persist) {
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

    type Snippet = {
      id: string;
      content: string;
      similarity: number;
    };

    const { data: snippets }: { data: Snippet[] | null } =
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

    // TODO: concatenate retrieved snippets to params.messages system prompt
    if (params.messages.some((message) => message.role == "system"))
      params.messages = params.messages.map((message) => {
        if (message.role == "system")
          return {
            ...message,
            content: prependMessage + "\n" + message.content,
          };
        return message;
      });
    else
      params.messages = [
        { role: "system", content: prependMessage },
        ...params.messages,
      ];
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

    event.waitUntil(logRequest(apiKey, params, response, +new Date() - start));

    return new Response(JSON.stringify(response), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
