// app/api/chat/route.ts

import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "~/env.mjs";
import { authOptions } from "../../server/auth";

export const config = {
  runtime: "edge",
};

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, apiKey, context, remember } = await req.json();

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: "https://remembrall.dev/api/openai/v1",
    defaultHeaders: {
      "x-gp-api-key": apiKey,
      "x-gp-context": context ?? undefined,
      "x-gp-remember": remember ?? undefined,
    },
  });

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
