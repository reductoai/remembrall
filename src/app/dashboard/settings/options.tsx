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
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/client";
import { useToast } from "~/components/ui/use-toast";
import { useTheme } from "next-themes";

export default function Options() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const context = api.useContext();
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="theme">Theme</Label>
        <Select
          value={theme}
          onValueChange={(e) => {
            setTheme(e);
          }}
        >
          <SelectTrigger id="theme" className="w-full">
            <SelectValue />
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
    </>
  );
}
