"use client";

import { Button } from "~/components/ui/button";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage: string = Array.isArray(error) ? error.pop() : error;
    if (errorMessage) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              setLoading(true);
              signIn("github");
            }}
          >
            Try again
          </ToastAction>
        ),
      });
      setLoading(false);
    }
  }, [error, toast]);

  return (
    <div className="flex w-full flex-col space-y-2">
      <Button
        className="w-full"
        variant="outline"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          signIn("github");
        }}
      >
        <>
          {loading ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          <svg
            className="mr-2 h-4 w-4 text-black dark:text-white"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Login with GitHub
        </>
      </Button>
      <Button
        className="w-full"
        variant="outline"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          signIn("google");
        }}
      >
        <>
          {loading ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          <svg
            className="mr-2 h-4 w-4 text-black dark:text-white"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 18 18"
          >
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
          </svg>
          Login with Google
        </>
      </Button>
    </div>
  );
}
