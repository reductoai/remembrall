"use client";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function Help() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setShowHelp(localStorage.getItem("showHelp") !== "false");
  }, []);

  const setSaveShowHelp = (value: boolean) => {
    localStorage.setItem("showHelp", value ? "true" : "false");
    setShowHelp(value);
  };

  return (
    <AnimatePresence>
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
