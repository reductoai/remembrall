"use client";

import { Database, FileStack, HistoryIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  CreateDocContext,
  DisplayDocContexts,
} from "~/app/(dashboard)/powerups/doc-context";

export default function Powerups() {
  const [input, setInput] = useState("");
  const insertEmbedding = api.vector.insertTextEmbedding.useMutation();

  return (
    <div className="w-full min-w-[600px]">
      <Tabs defaultValue="account" className="h-fit w-full">
        <TabsList className="h-fit w-full">
          <TabsTrigger value="account" className="w-1/2 text-lg">
            <FileStack className="mr-2 h-4 w-4" />
            Document Context
          </TabsTrigger>
          <TabsTrigger
            value="password"
            disabled={true}
            className="w-1/2 text-lg"
          >
            <HistoryIcon className="mr-2 h-4 w-4" />
            Remember History
            <Badge className="ml-2">Coming Soon</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="flex flex-col space-y-2 p-2">
          <CreateDocContext />
          <DisplayDocContexts />
        </TabsContent>
        <TabsContent value="password">Coming soon.</TabsContent>
      </Tabs>
    </div>
  );
}
