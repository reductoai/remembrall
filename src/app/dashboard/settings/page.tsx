import { Card, CardContent, CardHeader } from "~/components/ui/card";

import { getLogsCode } from "~/app/dashboard/settings/code";
import Docs from "~/app/dashboard/settings/docs";
import Options from "~/app/dashboard/settings/options";
import { StripeDashboard } from "~/app/dashboard/settings/stripe";

export default async function Settings() {
  const code = await getLogsCode();
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </CardHeader>
      <CardContent className="grid w-full gap-4">
        <Options />
        <Docs code={code} />
        <StripeDashboard />
      </CardContent>
    </Card>
  );
}
