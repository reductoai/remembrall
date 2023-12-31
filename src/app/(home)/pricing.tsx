"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { MagicCard, MagicContainer } from "~/components/magicui/magic-card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";
import { usePostHog } from "posthog-js/react";

export function Paywall({ children }: { children: React.ReactNode }) {
  const user = api.settings.getUser.useQuery();
  if (!user.data) return <p>Loading...</p>;
  if (user.data.subscription === "active") return <>{children}</>;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-8">
      <p className="text-center text-2xl text-foreground">
        Subscribe to access this feature.
      </p>
      <Pricing hideFree />
    </div>
  );
}

export function Pricing({ hideFree }: { hideFree?: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();

  const checkout = api.stripe.createCheckoutSession.useMutation({
    onMutate: (data) => {
      if (!session?.user) router.push(`/login?purchase=${data}`);
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) router.push(data.checkoutUrl);
    },
  });

  const toast = useToast();
  const posthog = usePostHog();

  return (
    <MagicContainer
      className={
        "mx-auto flex w-full max-w-7xl flex-col gap-4 px-8 md:flex-row lg:p-0"
      }
    >
      {!hideFree ? (
        <MagicCard className="mx-auto flex w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden px-8 py-12 shadow-2xl">
          <p className="z-10 mb-8 text-xl text-muted-foreground">Free</p>
          <p className="z-10 text-2xl text-foreground">Free for everyone</p>

          <Separator className="z-10 mb-4 mt-10" />

          <div className="flex flex-col space-y-2">
            <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
              <Check className="mr-2 h-4 w-4 stroke-primary" />
              Unlimited Playground Usage
            </div>
            <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
              <Check className="mr-2 h-4 w-4 stroke-primary" />
              Unlimited LLM Calls
            </div>
            <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
              <Check className="mr-2 h-4 w-4 stroke-primary" />
              Full Observability
            </div>
            <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
              <Check className="mr-2 h-4 w-4 stroke-primary" />
              Unlimited Data Export
            </div>
          </div>
          <Button
            className="z-10 mt-16 w-full rounded-full"
            variant={"outline"}
            asChild
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
          {/* <p className="">Unlimited Playground Usage</p> */}
        </MagicCard>
      ) : null}
      <MagicCard className="mx-auto flex w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden px-8 py-12 shadow-2xl">
        <p className="z-10 mb-8 text-xl text-muted-foreground">Starter</p>
        <p className="z-10 text-2xl text-foreground">$50/month</p>

        <Separator className="z-10 mb-4 mt-10" />

        <div className="flex flex-col space-y-2">
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            Everything in free plus:
          </div>
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            <Check className="mr-2 h-4 w-4 stroke-primary" />
            {"Long-term Memory API"}
          </div>
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            <Check className="mr-2 h-4 w-4 stroke-primary" />
            Retrieval Augmented Generation
          </div>
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            <Check className="mr-2 h-4 w-4 stroke-primary" />
            Instant Chat Replay
          </div>
        </div>
        <Button
          className="z-10 mt-16 w-full rounded-full"
          loading={checkout.isLoading && checkout.variables === "base"}
          onClick={() => {
            posthog.capture("base-checkout-click");
            checkout.mutate("base");
          }}
        >
          Get Started
        </Button>
        {/* <p className="">Unlimited Playground Usage</p> */}
      </MagicCard>
      <MagicCard className="mx-auto flex w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden px-8 py-12 shadow-2xl">
        <p className="z-10 mb-8 text-xl text-muted-foreground">Enterprise</p>
        <p className="z-10 text-2xl text-foreground">Contact Us</p>
        <Separator className="z-10 mb-4 mt-10" />
        <div className="flex flex-col space-y-2">
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            Everything in starter plus:
          </div>
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            <Check className="mr-2 h-4 w-4 stroke-primary" />
            Access Memory Stores Programmatically
          </div>
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            <Check className="mr-2 h-4 w-4 stroke-primary" />
            Document Context API
          </div>
          <div className="z-10 flex flex-row items-center text-base text-muted-foreground">
            <Check className="mr-2 h-4 w-4 stroke-primary" />
            24/7 Dedicated Support
          </div>
        </div>
        <Button
          className="z-10 mt-16 w-full rounded-full"
          variant={"secondary"}
          loading={checkout.isLoading && checkout.variables === "full"}
          asChild
        >
          <Link
            href="mailto:sales@reducto.ai"
            onClick={() => {
              posthog.capture("enterprise-contact-us-click");
            }}
          >
            Contact Us
          </Link>
        </Button>
        <div
          onClick={() => {
            toast.toast({
              title: "Self-Onboarding Coming Soon!",
              description: "We're on this, will roll out it out ASAP.",
            });

            posthog.capture("self-onboarding-attempt");
          }}
          className="z-10 mt-2 flex flex-row text-sm text-muted-foreground underline"
        >
          or self-onboard @ $2000/month + $0.008/API call
        </div>
      </MagicCard>
    </MagicContainer>
  );
}
