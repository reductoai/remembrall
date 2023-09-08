"use server";

import { FileStack, HistoryIcon } from "lucide-react";

import {
  CreateDocContext,
  DisplayDocContexts,
} from "~/app/dashboard/spells/doc-context";
import Remember from "~/app/dashboard/spells/remember";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default async function Spells() {
  return (
    <div className="w-full min-w-[600px]">
      <Tabs defaultValue="account" className="h-fit w-full">
        <TabsList className="h-fit w-full">
          <TabsTrigger value="account" className="w-1/2 text-lg">
            <FileStack className="mr-2 h-4 w-4" />
            Document Context
          </TabsTrigger>
          <TabsTrigger value="password" className="w-1/2 text-lg">
            <HistoryIcon className="mr-2 h-4 w-4" />
            Remember History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="flex flex-col space-y-2 p-2">
          <CreateDocContext />
          <DisplayDocContexts />
        </TabsContent>
        <TabsContent value="password">
          <Remember />
        </TabsContent>
      </Tabs>
    </div>
  );
}
