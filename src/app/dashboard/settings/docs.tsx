"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Copy, RefreshCcw } from "lucide-react";
import { v4 as uuid } from "uuid";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

import { Card, Flex, Text, Title } from "@tremor/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Tabs, TabsTrigger, TabsList } from "~/components/ui/tabs";
import { api } from "~/trpc/client";
import { useToast } from "~/components/ui/use-toast";

const Docs = ({ code }: { code: any }) => {
  let tabs = [
    { id: "curl", label: "Curl" },
    { id: "js", label: "Javascript" },
    { id: "nodejs", label: "Node.JS" },
    { id: "python", label: "Python" },
  ] as const;

  let [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const { data } = api.settings.getUser.useQuery();
  const { toast } = useToast();

  const key = data?.apiKey;

  const context = api.useContext();

  const user = api.settings.getUser.useQuery();
  const updateUser = api.settings.updateUser.useMutation({
    onSuccess: () => {
      context.settings.getUser.reset();
    },
  });

  return (
    <>
      <div className="grid max-w-full gap-1.5">
        <Label htmlFor="apikey" className="whitespace-nowrap">
          API Key
        </Label>
        {user.data ? (
          <div className="flex flex-row space-x-2">
            <Input
              spellCheck={false}
              contentEditable={false}
              id="apikey"
              value={user.data.apiKey}
              className="grow"
            ></Input>{" "}
            <Button
              variant={"secondary"}
              onClick={() => {
                navigator.clipboard.writeText(user.data.apiKey);
                toast({
                  title: "Copied to Clipboard",
                  description:
                    "Your API key has been copied to your clipboard.",
                  duration: 1000,
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Cycle API Token</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cycle your API token? This will
                    revoke your current token and generate a new one.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-row justify-between">
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateUser.mutate({
                          apiKey: `gp-${uuid()}`,
                        });
                      }}
                    >
                      Continue
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="secondary">No thanks</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex h-10 w-full flex-row space-x-2">
            <Skeleton className="h-full grow" />
            <Skeleton className="h-full w-12" />
            <Skeleton className="h-full w-12" />
          </div>
        )}
      </div>
      <div className="w-full max-w-full">
        <Label>Installation</Label>
        <Tabs
          value={activeTab}
          onValueChange={(e) => {
            setActiveTab(e);
          }}
        >
          <TabsList className="flex w-full flex-row justify-between">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="w-full">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-2 space-y-2">
          <motion.div
            className="md"
            // layoutId={"bubble"} // Add a layoutId for shared layout animations
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            dangerouslySetInnerHTML={{
              __html:
                activeTab === "curl"
                  ? code.curl.replace(
                      "$LLM_REPORT_API_KEY",
                      key || "$LLM_REPORT_API_KEY"
                    )
                  : activeTab === "js"
                  ? code.js.replace(
                      "${process.env.LLM_REPORT_API_KEY}",
                      key || "process.e"
                    )
                  : activeTab === "nodejs"
                  ? code.nodejs.replace(
                      "${process.env.LLM_REPORT_API_KEY}",
                      key || "process.e"
                    )
                  : activeTab === "python"
                  ? code.python.replace(
                      'os.getenv("OPENAI_API_KEY")',
                      key || 'os.getenv("OPENAI_API_KEY")'
                    )
                  : "",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Docs;
