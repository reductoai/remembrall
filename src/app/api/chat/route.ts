// app/api/chat/route.ts

import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { env } from "~/env.mjs";

export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, apiKey, context, remember } = await req.json();

  const headers: any = { "x-gp-api-key": apiKey };
  if (context) headers["x-gp-context"] = context;
  if (remember) headers["x-gp-remember"] = remember;

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    // baseURL: "https://remembrall.dev/api/openai/v1",
    baseURL: "http://localhost:3000/api/openai/v1",
    defaultHeaders: headers,
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
