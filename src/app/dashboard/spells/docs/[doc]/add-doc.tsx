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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/client";
import { Input } from "~/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

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
