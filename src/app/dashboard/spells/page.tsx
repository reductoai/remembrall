"use server";

import { BrainIcon, FileStack, HistoryIcon } from "lucide-react";
import { getRagCode } from "~/app/dashboard/settings/code";

import {
  CreateDocContext,
  DisplayDocContexts,
} from "~/app/dashboard/spells/doc-context";
import Remember from "~/app/dashboard/spells/remember";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Docs from "~/app/dashboard/settings/docs";

export default async function Spells() {
  const code = await getRagCode();
  return (
    <div className="w-full min-w-[600px]">
      <Tabs defaultValue="history" className="h-fit w-full">
        <TabsList className="h-fit w-full">
          <TabsTrigger value="history" className="w-1/2 text-lg">
            <BrainIcon className="mr-2 h-4 w-4" />
            Long Term Memory
          </TabsTrigger>
          <TabsTrigger value="doc" className="w-1/2 text-lg">
            <FileStack className="mr-2 h-4 w-4" />
            Document Context
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Remember />
        </TabsContent>
        <TabsContent value="doc" className="flex flex-col space-y-4 p-2">
          <Docs code={code} />
          <CreateDocContext />
          <DisplayDocContexts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
