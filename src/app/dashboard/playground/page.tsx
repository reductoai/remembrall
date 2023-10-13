"use client";

import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { v4 } from "uuid";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { usePostHog } from "posthog-js/react";
import { ChatRequestOptions } from "ai";

export default function Playground() {
  const searchParams = useSearchParams();
  const loadedMessages = searchParams?.get("messages");

  const contexts = api.vector.docContexts.useQuery();

  const [session, setSession] = useState("");
  const [history, setHistory] = useState(false);
  const [context, setContext] = useState(false);
  const [contextId, setContextId] = useState("");

  const user = api.settings.getUser.useQuery(undefined, {
    onSuccess: (data) => {
      if (data.gh_username && session === "") {
        setSession(data.gh_username);
        setHistory(true);
      }
    },
  });

  const posthog = usePostHog();

  const { handleSubmit, messages, input, handleInputChange, setMessages } =
    useChat({
      api: "/api/chat",
      body: {
        apiKey: user.data?.apiKey,
        remember: history ? session : undefined,
        context: context ? contextId : undefined,
      },
      initialMessages: loadedMessages
        ? JSON.parse(loadedMessages).map((m: any) => ({ ...m, id: v4() }))
        : [
            {
              id: "0",
              role: "system",
              content: "You are a helpful agent",
            },
          ],
    });

  const handleSubmitWrapper = (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => {
    posthog.capture("playground_chat");
    handleSubmit(e, chatRequestOptions);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full grow flex-col space-y-4">
        <div className="w-full space-y-4">
          <div>
            <Label>Long Term Memory</Label>
            <div className="flex flex-row items-center space-x-2">
              <Switch
                checked={history}
                onCheckedChange={(c) => setHistory(c)}
              />
              <Input
                placeholder="Session ID"
                disabled={history === false}
                value={session}
                onChange={(e) => {
                  setSession(e.target.value);
                }}
              />
            </div>
          </div>

          <div>
            <Label>Document Contexts</Label>
            <div className="flex flex-row items-center space-x-2">
              <Switch
                checked={context}
                onCheckedChange={(c) => setContext(c)}
              />
              <Select
                disabled={!context}
                onValueChange={(e) => {
                  setContextId(e);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a document context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Document Contexts</SelectLabel>
                    {contexts.data?.map((context) => (
                      <SelectItem key={context.id} value={context.id}>
                        {context.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>System Message</Label>
            <Textarea
              value={messages[0]?.role === "system" ? messages[0].content : ""}
              disabled={messages[0]?.role !== "system"}
              onChange={(e) => {
                setMessages(
                  messages.map((m, i) =>
                    i === 0 ? { ...m, content: e.target.value } : m
                  )
                );
              }}
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
                  "flex w-fit max-w-[75%] flex-col gap-2 whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
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
        onSubmit={handleSubmitWrapper}
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
