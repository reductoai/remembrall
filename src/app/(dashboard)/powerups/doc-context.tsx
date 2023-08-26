"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";

import { Copy, Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/client";

export function CreateDocContext() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Document Context
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Document Context</DialogTitle>
          <DialogDescription>
            A document context is a collection of documents that can be provided
            to your language model as context.
          </DialogDescription>

          <CreateDocContextForm
            close={() => {
              setOpen(false);
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function CreateDocContextForm({ close }: { close: () => void }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof createDocContextSchema>>({
    resolver: zodResolver(createDocContextSchema),
    defaultValues: {
      chunkSize: 512,
    },
  });

  const { toast } = useToast();

  const context = api.useContext();
  const createDocContext = api.vector.createDocContext.useMutation({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
    onSuccess: () => {
      close();
      context.vector.docContexts.invalidate();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          createDocContext.mutate(values);
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Documents" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chunkSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chunk Size</FormLabel>
              <FormControl className="grow">
                <Slider
                  {...field}
                  value={[field.value]}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                  min={256}
                  max={1024}
                  step={1}
                />
              </FormControl>
              <FormDescription>
                The size of chunks (in tokens) your documents will be split
                into.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {createDocContext.isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Document Context
        </Button>
      </form>
    </Form>
  );
}

import { useRouter } from "next/navigation";
import { createDocContextSchema } from "~/app/(dashboard)/powerups/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";

export function DisplayDocContexts() {
  const docContexts = api.vector.docContexts.useQuery();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const context = api.useContext();
  const deleteDocContext = api.vector.deleteDocContext.useMutation({
    onSuccess: () => {
      setOpen(false);
      context.vector.docContexts.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });
  const { push } = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Chunk Size</TableHead>
          <TableHead># of Documents</TableHead>
          <TableHead>API ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {docContexts.data?.map((docContext, idx) => (
          <TableRow
            key={idx}
            className="cursor-pointer"
            onClick={() => {
              console.log("Clicked", docContext.id);
              push(`/powerups/docs/${docContext.id}`);
            }}
          >
            <TableCell className="font-medium">{docContext.name}</TableCell>
            <TableCell>{docContext.chunkSize}</TableCell>
            <TableCell>{docContext.document.length}</TableCell>
            <TableCell className="flex flex-row text-right">
              <Input readOnly spellCheck={false} value={docContext.id} />
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(docContext.id);
                  toast({
                    variant: "default",
                    title: "Copied to clipboard!",
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  className={buttonVariants({ variant: "destructive" })}
                >
                  <Trash className="h-4 w-4" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Delete Document Context</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this document context?
                      This will delete all nested documents.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex flex-row justify-between">
                    <Button
                      disabled={deleteDocContext.isLoading}
                      variant="destructive"
                      onClick={() => {
                        deleteDocContext.mutate(docContext.id);
                      }}
                    >
                      {deleteDocContext.isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Continue
                    </Button>
                    <DialogClose asChild>
                      <Button variant="secondary">No thanks</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
