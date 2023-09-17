"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.10.111/build/pdf.worker.min.js";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/client";
import { Input } from "~/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import { useState } from "react";

// export function AddPdfDocument({docContextId}: {docContextId: string}) {

// }

export default function AddTextDocument({
  docContextId,
}: {
  docContextId: string;
}) {
  const AddDocFormSchema = z.object({
    name: z.string().min(1),
    content: z.string().min(1),
  });

  const addDocForm = useForm<z.infer<typeof AddDocFormSchema>>({
    resolver: zodResolver(AddDocFormSchema),
  });

  const { toast } = useToast();

  const context = api.useContext();

  const addDoc = api.vector.createDoc.useMutation({
    onSuccess: () => {
      addDocForm.reset();
      context.vector.docContexts.invalidate();
      context.vector.docContext.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  return (
    <Form {...addDocForm}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={addDocForm.handleSubmit(({ name, content }) => {
          addDoc.mutate({
            contextId: docContextId,
            name,
            content,
          });
        })}
      >
        <FormField
          control={addDocForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Document Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={addDocForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="My document contents here..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Copy paste the text of the document above.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={addDoc.isLoading} type="submit">
          {addDoc.isLoading ? (
            <Loader2Icon className="mr-2 animate-spin" />
          ) : null}
          Add Document
        </Button>
      </form>
    </Form>
  );
}

export function AddPdfDocument({ docContextId }: { docContextId: string }) {
  const AddDocFormSchema = z.object({
    name: z.string().min(1),
  });

  const addDocForm = useForm<z.infer<typeof AddDocFormSchema>>({
    resolver: zodResolver(AddDocFormSchema),
  });

  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const context = api.useContext();

  const addDoc = api.vector.createDoc.useMutation({
    onSuccess: () => {
      addDocForm.reset();
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

  return (
    <Form {...addDocForm}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={addDocForm.handleSubmit(({ name }) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            if (!e.target?.result) return;
            let doc = await pdfjs.getDocument({ data: e.target.result })
              .promise;
            let pageTexts = Array.from(
              { length: doc.numPages },
              async (v, i) => {
                return (await (await doc.getPage(i + 1)).getTextContent()).items
                  .map((token) => ("str" in token ? token.str : ""))
                  .join(" ");
              }
            );
            const fulText = (await Promise.all(pageTexts)).join("");

            addDoc.mutate({
              contextId: docContextId,
              name,
              content: fulText,
            });
          };

          reader.readAsArrayBuffer(file!);
        })}
      >
        <FormField
          control={addDocForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Document Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>PDF Document</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept=".pdf"
              onChange={(f) => {
                if (!f.target.files) setFile(null);
                else setFile(f.target.files[0]);
              }}
            />
          </FormControl>
          <FormDescription>Upload a PDF document above.</FormDescription>
          <FormMessage />
        </FormItem>
        <Button disabled={addDoc.isLoading} type="submit">
          {addDoc.isLoading ? (
            <Loader2Icon className="mr-2 animate-spin" />
          ) : null}
          Add Document
        </Button>
      </form>
    </Form>
  );
}
