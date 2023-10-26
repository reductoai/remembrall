"use client";

import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import {
  experimental_createActionHook,
  experimental_serverActionLink,
} from "@trpc/next/app-dir/client";
import superjson from "superjson";
import { type AppRouter } from "~/server/api/root";
import { transformer } from "./shared";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

// export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
//   config() {
//     return {
//       transformer,
//       links: [
//         loggerLink({
//           enabled: (op) =>
//             process.env.NODE_ENV === "development" ||
//             (op.direction === "down" && op.result instanceof Error),
//         }),
//         httpBatchLink({
//           url: getUrl(),
//           headers() {
//             return {
//               "x-trpc-source": "client",
//             };
//           },
//         }),
//       ],
//     };
//   },
// });

export const useAction = experimental_createActionHook({
  links: [loggerLink(), experimental_serverActionLink()],
  transformer,
});

/** Export type helpers */
export type * from "./shared";
