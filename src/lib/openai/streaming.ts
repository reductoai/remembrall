import type OpenAI from "openai";
import { createParser } from "eventsource-parser";
import { ChatCompletion } from "openai/resources/chat";

/**
 * Extract an OpenAI stream and simultaneously pass it on to the user as a response. Ideally can return the response directly, alternatively will need
 */
export function splitOpenaiStream(
  stream: ReadableStream<Uint8Array>
): [
  Promise<OpenAI.Chat.Completions.ChatCompletion>,
  ReadableStream<Uint8Array>
] {
  let chunks: OpenAI.Chat.ChatCompletionChunk[] = [];

  let resolveCompletion: (
    value: OpenAI.Chat.Completions.ChatCompletion
  ) => void;
  const completionPromise = new Promise<OpenAI.Chat.Completions.ChatCompletion>(
    (resolve) => {
      resolveCompletion = resolve;
    }
  );

  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      const reader = stream.getReader();

      const parser = createParser((event) => {
        if (event.type === "event") {
          if (event.data === "[DONE]") {
            controller.close();
            // merge chunks
            const combined_response = "";

            const choice: OpenAI.Chat.ChatCompletion.Choice = {
              finish_reason: "stop",
              index: 0,
              message: {
                content: null,
                role: "assistant",
                function_call: undefined,
              },
            };

            chunks.forEach((chunk) => {
              if (chunk.choices[0].finish_reason) choice.finish_reason = "stop";
              if (chunk.choices[0].delta.content) {
                if (choice.message.content === null)
                  choice.message.content = "";
                choice.message.content! += chunk.choices[0].delta.content;
              }
              if (chunk.choices[0].delta.role)
                choice.message.role = chunk.choices[0].delta.role;
              if (chunk.choices[0].delta.function_call) {
                if (choice.message.function_call === undefined)
                  choice.message.function_call = chunk.choices[0].delta
                    .function_call as any;
                else {
                  choice.message.function_call = {
                    name: chunk.choices[0].delta.function_call.name!,
                    arguments:
                      choice.message.function_call.arguments +
                      chunk.choices[0].delta.function_call.arguments!,
                  };
                }
              }
            });

            resolveCompletion({
              choices: [choice],
              id: chunks[0].id,
              created: chunks[0].created,
              model: chunks[0].model,
              object: chunks[0].object,
            });
          } else {
            const data = JSON.parse(
              event.data
            ) as OpenAI.Chat.ChatCompletionChunk;
            chunks.push(data);
          }
        }
      });

      reader.read().then(function process({ done, value }) {
        if (!done && value) {
          const decoded = new TextDecoder("utf-8").decode(value);
          controller.enqueue(value);
          parser.feed(decoded);
          reader.read().then(process);
        }
      });
    },
  });

  return [completionPromise, readable];
}
