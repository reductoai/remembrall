"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import type { RouterOutputs } from "~/trpc/client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button, buttonVariants } from "~/components/ui/button";
import Link from "next/link";
import OpenAI from "openai";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import colors from "tailwindcss/colors";
import {
  ArrowLeftRight,
  ArrowRight,
  MessagesSquare,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import type { MemoryDiff } from "~/pages/api/openai/v1/chat/completions";
import { Alert, AlertTitle } from "~/components/ui/alert";

type Rows = RouterOutputs["stats"]["getRequestsRaw"][0];
type Message = OpenAI.Chat.Completions.ChatCompletionMessage;

export const modelColors: { [key: string]: keyof typeof colors } = {
  "gpt-3.5-turbo": "violet",
  "gpt-4": "yellow",
};

export const columns: ColumnDef<Rows>[] = [
  {
    header: "Model",
    accessorKey: "model",
    cell: ({ getValue }) => {
      const model = getValue() as string;
      const color = modelColors[model] ?? "gray";
      return (
        <Badge
          className=" whitespace-nowrap"
          style={{ backgroundColor: colors[color][500] }}
        >
          {model}
        </Badge>
      );
    },
  },
  {
    header: "Tokens",
    accessorKey: "numTokens",
  },
  {
    header: "Time",
    accessorKey: "createdAt",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleString([], {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    header: "Duration (ms)",
    accessorKey: "duration",
  },
  // {
  //   header: "Delta",
  //   cell: ({ row }) => {
  //     return <pre>{JSON.stringify(row.original.memoryUpdate)}</pre>;
  //   },
  // },
  {
    header: "Prompt",
    accessorKey: "request",
    cell: ({ getValue }) => {
      const value: any = getValue() as Rows["request"];

      // concatentate all the prompt messages
      const messages =
        value.messages
          .map((message: Message) => message.content)
          .join("\n")
          .slice(0, 30) + "...";

      return messages;
    },
  },
  {
    header: "Response",
    accessorKey: "response",
    cell: ({ getValue }) => {
      const value: any = getValue() as Rows["response"];
      const message = value["choices"][0]["message"]["content"];
      return message.slice(0, 30) + "...";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const response = row.getValue("response") as OpenAI.Chat.ChatCompletion;

      const messages: Message[] = [
        ...(row.getValue("request") as any).messages,
        response.choices[0]?.message,
      ];

      const url =
        "/dashboard/playground/?messages=" +
        encodeURIComponent(JSON.stringify(messages));

      // return (
      //   <Link href={url} className={buttonVariants({ variant: "outline" })}>
      //     <MessagesSquare className="h-4 w-4" />
      //   </Link>
      // );

      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <SheetContent className="overflow-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Request</SheetTitle>
              {/* <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription> */}
            </SheetHeader>
            <Card>
              <CardHeader>
                <h2 className="whitespace-pre-wrap">
                  {messages.find((m: Message) => m.role === "system")
                    ?.content ?? "No system prompt provided."}
                </h2>
              </CardHeader>
              <CardContent>
                {messages
                  .filter(
                    (message: Message) =>
                      message.role !== "system" && message.role !== "function"
                  )
                  .map((message: Message, index: number) => (
                    <>
                      {index === messages.length - 1 ? (
                        <Separator className="my-4 w-full" />
                      ) : null}
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
                    </>
                  ))}
              </CardContent>
              <CardFooter>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full"
                  )}
                  href={url}
                >
                  Continue in Playground
                </Link>
              </CardFooter>
            </Card>
            {(row.original.memoryUpdate as MemoryDiff | null)?.map(
              (delta, idx) =>
                delta.type === "insert" ? (
                  <Alert key={idx}>
                    <PlusIcon className="h-4 w-4" />
                    <AlertTitle>{delta.content}</AlertTitle>
                  </Alert>
                ) : (
                  <Alert key={idx} className="my-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    <AlertTitle className="flex flex-row items-center">
                      {delta.replaced} <ArrowRight className="mx-2 h-4 w-4" />{" "}
                      {delta.content}
                    </AlertTitle>
                  </Alert>
                )
            )}
          </SheetContent>
        </Sheet>
      );
    },
  },
];
