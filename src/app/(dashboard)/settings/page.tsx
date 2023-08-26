"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Copy, RefreshCcw } from "lucide-react";
import { v4 as uuid } from "uuid";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
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

import { useTheme } from "next-themes";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const context = api.useContext();
  const user = api.settings.getUser.useQuery();
  const updateUser = api.settings.updateUser.useMutation({
    onSuccess: () => {
      context.settings.getUser.reset();
    },
  });

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
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

        <div className="grid gap-1.5">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={theme}
            onValueChange={(e) => {
              setTheme(e);
            }}
          >
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
