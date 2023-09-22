"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { api } from "~/trpc/client";

export default function Track({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  const user = api.settings.getUser.useQuery();

  /** Identify user */
  useEffect(() => {
    if (user.data) {
      posthog.identify(user.data.id, {
        email: user.data.email,
      });
    }
  }, [user.data, posthog]);

  return <main className="h-screen">{children}</main>;
}
