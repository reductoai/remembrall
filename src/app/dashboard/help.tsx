"use client";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LayoutDashboard, MessagesSquare, Wand2, X } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function Help() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setShowHelp(localStorage.getItem("showHelp") !== "false");
  }, []);

  const setSaveShowHelp = (value: boolean) => {
    localStorage.setItem("showHelp", value ? "true" : "false");
    setShowHelp(value);
  };

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const router = useRouter();

  return (
    <AnimatePresence>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => {
                router.push("/dashboard");
                setOpen(false);
              }}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/playground");
                setOpen(false);
              }}
            >
              <MessagesSquare className="mr-2 h-4 w-4" />
              <span>Playground</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/spells");
                setOpen(false);
              }}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              <span>Spells</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/settings");
                setOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          {/* <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>

      {showHelp && (
        <motion.div className="border-1 flex w-full max-w-[16rem] flex-col space-y-2 border-l p-6 text-sm">
          <X
            className="ml-auto cursor-pointer"
            onClick={() => {
              setSaveShowHelp(false);
            }}
          />
          <h2 className="text-lg font-semibold">Onboarding Checklist</h2>
          <div className="flex flex-row space-x-4">
            <Checkbox className="mt-1" />
            <label>
              {
                'Send a message on the playground. Try sending "my favorite color is blue"'
              }
            </label>
          </div>
          <div className="flex flex-row space-x-4">
            <Checkbox className="mt-1" />
            <label>Open a chat message in the dashboard.</label>
          </div>
          <div className="flex flex-row space-x-4">
            <Checkbox className="mt-1" />
            <label>
              Send another message, try asking in the playground if it remembers
              your favorite color.
            </label>
          </div>
          <div className="flex flex-row space-x-4">
            <Checkbox className="mt-1" />
            <label>
              Send an API request to the platform (see integration instructions
              on the Spells page)
            </label>
          </div>
          <div className="flex flex-row space-x-4">
            <Checkbox className="mt-1" />
            <label>Upload a document from the spells page.</label>
          </div>
        </motion.div>
      )}
      {!showHelp && (
        <>
          <Button
            variant={"outline"}
            className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl shadow-xl"
            onClick={() => {
              setSaveShowHelp(true);
            }}
          >
            ?
          </Button>
        </>
      )}
    </AnimatePresence>
  );
}
