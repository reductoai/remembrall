"use client";

import { ChatRequestOptions } from "ai";
import { useChat } from "ai/react";
import { Pause, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/client";

export default function HomepageChat({ vanilla }: { vanilla?: boolean }) {
  const user = api.settings.getUser.useQuery(undefined, {});

  const posthog = usePostHog();

  const { handleSubmit, messages, input, handleInputChange, isLoading, stop } =
    useChat({
      api: "/api/chat",
      body: {
        apiKey: "gp-c56b8fc7-e7ab-424f-b438-a18796959525",
        remember: vanilla ? undefined : "homepage",
      },
      initialMessages: [
        {
          id: "0",
          role: "system",
          content: vanilla
            ? "You are an unhelpful agent. Be vague and generic. Keep asking the user for more info."
            : "You are a helpful agent. Never be vague or generic. Make up information about the user if you don't have any. Don't ask the user for their preferences - just make them up.",
        },
        {
          id: "1",
          role: "user",
          content: "Can you recommmend me some shoes?",
        },
        {
          id: "1",
          role: "assistant",
          content: vanilla
            ? "I don't have specific information about your preferences or needs. Please provide more details about the type of shoes you're looking for, such as the occasion, style, and any specific requirements."
            : "Sure! I know you love Nike and hypebeast fashion, so how about some" +
              " Air Jordan 1 Retro High OG 'University Blue'? They are quite popular right now.",
        },
      ],
    });

  const handleSubmitWrapper = (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => {
    posthog.capture("homepage_chat");
    handleSubmit(e, chatRequestOptions);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full grow flex-col space-y-4">
        <div className="w-full space-y-4">
          {messages
            .filter(
              (message) =>
                message.role !== "system" && message.role !== "function"
            )
            .map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-fit max-w-[75%] flex-col gap-2 whitespace-pre-wrap rounded-lg px-3 py-2 text-left text-sm",
                  message.role === "user"
                    ? "ml-auto bg-muted"
                    : "bg-primary text-primary-foreground",
                  vanilla ? "bg-muted text-foreground" : ""
                )}
              >
                {message.content}
              </div>
            ))}
        </div>
      </div>
      <form
        className="mt-4 flex w-full items-center space-x-2"
        onSubmit={handleSubmitWrapper}
      >
        <Input
          autoComplete="off"
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
          id="message"
          placeholder="Type your message..."
          className="flex-1"
        />
        {isLoading ? (
          <Button
            size="icon"
            variant={vanilla ? "secondary" : "default"}
            onClick={() => {
              stop();
            }}
          >
            <Pause className="h-4 w-4" />
            <span className="sr-only">Stop</span>
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            variant={vanilla ? "secondary" : "default"}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        )}
      </form>
    </div>
  );
}
