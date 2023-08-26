"use client";

import { Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useChat } from "ai/react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { v4 } from "uuid";
import { Card, CardHeader } from "~/components/ui/card";

export default function Playground() {
  const searchParams = useSearchParams();
  const loadedMessages = searchParams?.get("messages");

  const { handleSubmit, messages, input, handleInputChange } = useChat({
    api: "/api/openai/v1/chat/completions",
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
            role: "assistant",
            content: "Hello, how are you?",
          },
        ],
  });

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full grow flex-col space-y-4">
        <div className="w-full space-y-4">
          <div>
            <Label>System Message</Label>
            <Textarea
              readOnly
              value={messages[0]?.role === "system" ? messages[0].content : ""}
            />
          </div>
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
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
        </div>
      </div>
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={handleSubmit}
      >
        <Input
          value={input}
          onChange={handleInputChange}
          id="message"
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
