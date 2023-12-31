"use server";

import { Paywall } from "~/app/(home)/pricing";
import { getUsersCode } from "~/app/dashboard/settings/code";
import Docs from "~/app/dashboard/settings/docs";
import { EditMemoryPrompt } from "~/app/dashboard/spells/prompt";

export default async function Remember() {
  const code = await getUsersCode();

  return (
    <div className="-mt-4 flex flex-col space-y-6 p-4">
      <p className="text-base text-foreground">
        Just pass in the user session ID, can be any unique identifier whether a
        user email, or a unique session token, or anything else. All messages
        with the same user ID will be grouped together and the memory will be
        persisted and recalled dynamically as necessary.
      </p>
      <Docs code={code} />
      <EditMemoryPrompt />
      <Paywall>
        <br />
      </Paywall>
    </div>
  );
}
