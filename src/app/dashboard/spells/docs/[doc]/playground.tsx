"use client";

import { useChat } from "ai/react";
import { Card, CardHeader } from "~/components/ui/card";

export function DocChatPlayground() {
  const { handleSubmit, messages, input, handleInputChange } = useChat({
    api: "/api/openai/v1/chat/completions",
    initialMessages: [
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
    <Card>
      <CardHeader>
        <h2 className="pt-2 text-xl">Playground</h2>
      </CardHeader>
      {/* <CardContent className="flex flex-col items-end space-y-2 ">
        <MessageEditor />
        <Button variant="secondary" className="w-full">
          Add Message
        </Button>
      </CardContent> */}
    </Card>
  );
}
