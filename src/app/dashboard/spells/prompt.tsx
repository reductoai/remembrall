"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DEFAULT_MEMORY_PROMPT } from "~/lib/prompts/memory";
import { api } from "~/trpc/client";

/** Edit the Memory Prompt used to update the memory */
export function EditMemoryPrompt() {
  const user = api.settings.getUser.useQuery();
  const context = api.useContext();
  const update = api.settings.updateUser.useMutation({
    onSuccess: () => {
      context.settings.getUser.invalidate();
    },
  });

  const [prompt, setPrompt] = useState<null | string>(null);

  return user.data ? (
    <>
      <div className="flex flex-col space-y-2">
        <Label>Custom Memory Instructions</Label>
        <Textarea
          value={prompt ?? user.data?.memoryPrompt ?? DEFAULT_MEMORY_PROMPT}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        <p className="text-sm text-muted-foreground">
          This prompt is used to select which memories to retain.
        </p>
        <Button
          variant={"secondary"}
          disabled={
            !prompt ||
            prompt === (user.data?.memoryPrompt ?? DEFAULT_MEMORY_PROMPT)
          }
          loading={update.isLoading}
          onClick={() => {
            update.mutate({ memoryPrompt: prompt! });
          }}
        >
          Save Changes
        </Button>
        {user.data?.memoryPrompt !== DEFAULT_MEMORY_PROMPT ? (
          <Button
            variant={"destructive"}
            disabled={
              !prompt ||
              prompt === (user.data?.memoryPrompt ?? DEFAULT_MEMORY_PROMPT)
            }
            loading={update.isLoading}
            onClick={() => {
              setPrompt(null);
              update.mutate({ memoryPrompt: DEFAULT_MEMORY_PROMPT });
            }}
          >
            Reset Changes
          </Button>
        ) : null}
      </div>
    </>
  ) : null;
}
