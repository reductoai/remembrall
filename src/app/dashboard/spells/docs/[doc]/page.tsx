"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddTextDocument from "~/app/dashboard/spells/docs/[doc]/add-doc";
import { DocChatPlayground } from "~/app/dashboard/spells/docs/[doc]/playground";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/client";
import { getUsersCode } from "~/app/dashboard/settings/code";

export default function Document({ params }: { params: { doc: string } }) {
  const router = useRouter();
  const doc = api.vector.docContext.useQuery(params.doc, {
    onError: (err) => {
      router.push("/dashboard/spells");
    },
  });

  const [context, setContext] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-2">
      <Link href="/dashboard/spells" className="flex flex-row items-center">
        <ChevronLeft className="mr-2" />
        Document Contexts
      </Link>

      <Card>
        <form>
          <CardHeader>
            <input
              className="mx-auto border-none p-2 text-center text-xl hover:border"
              defaultValue={doc.data?.name}
            />
          </CardHeader>
          <CardContent className="flex flex-col space-y-1">
            <Label>Context System Message</Label>
            <Textarea
              value={context === null ? doc.data?.context : context}
              onChange={(e) => setContext(e.target.value)}
              name="context"
              className="min-h-8"
            />
            <p className="text-sm text-muted-foreground">
              This message will be prepended to any existing system message
              along with the retrieved relevant context from the uploaded
              documents.
            </p>
            {context !== null && context !== doc.data?.context ? (
              <Button className="w-full">Save Changes</Button>
            ) : null}
          </CardContent>
        </form>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Tabs defaultValue="text" className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-8">
              <h2 className="text-xl">Add Document</h2>
              <TabsList className="flex w-fit flex-row">
                <TabsTrigger value="text" className="w-fit">
                  Text
                </TabsTrigger>
                <TabsTrigger value="pdf" disabled className="w-fit">
                  PDF <Badge className="ml-2">Coming Soon</Badge>
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="text" className="w-full">
                {doc.data && <AddTextDocument docContextId={doc.data.id} />}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
        <DocChatPlayground />
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap gap-4">
        {doc.data?.document.map((d) => (
          <Card key={d.id} className="w-fit">
            <CardHeader>{d.name}</CardHeader>
            <CardContent>
              {d.snippets.length > 0 ? (
                <Badge className="bg-green-500 hover:bg-green-500">
                  Processed
                </Badge>
              ) : (
                <Badge className="bg-orange-500 hover:bg-orange-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
