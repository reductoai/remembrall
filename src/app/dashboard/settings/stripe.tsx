"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/client";

export function StripeDashboard() {
  const router = useRouter();
  const stripeDash = api.stripe.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      router.push(data.billingPortalUrl);
    },
  });
  return (
    <Button
      loading={stripeDash.isLoading}
      onClick={() => {
        stripeDash.mutate();
      }}
    >
      Open Billing Portal
    </Button>
  );
}
