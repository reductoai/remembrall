// app/api/chat/route.ts

import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "~/env.mjs";

export const config = {
  runtime: "edge",
  unstable_allowDynamic: [
    "**/node_modules/.pnpm/lodash/**/_root.js", // use a glob to allow anything in the function-bind 3rd party module
  ],
};

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

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
