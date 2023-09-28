"use client";

import { ChatRequestOptions } from "ai";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/client";

export default function HomepageChat({ vanilla }: { vanilla?: boolean }) {
  const searchParams = useSearchParams();
  const loadedMessages = searchParams?.get("messages");

  const user = api.settings.getUser.useQuery(undefined, {});

  const posthog = usePostHog();

  const { handleSubmit, messages, input, handleInputChange } = useChat({
    api: "/api/chat",
    body: {
      apiKey: user.data?.apiKey,
      remember: vanilla ? undefined : "homepage",
    },
    initialMessages: loadedMessages
      ? JSON.parse(loadedMessages).map((m: any) => ({ ...m, id: v4() }))
      : [
          {
            id: "0",
            role: "system",
            content: "You are a helpful agent",
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
                  "flex w-fit max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
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
          value={input}
          onChange={handleInputChange}
          id="message"
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          variant={vanilla ? "secondary" : "default"}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
