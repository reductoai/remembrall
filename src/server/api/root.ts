import { settingsRouter } from "~/server/api/routers/settings";
import { statsRouter } from "~/server/api/routers/stats";
import { stripeRouter } from "~/server/api/routers/stripe";
import { vectorRouter } from "~/server/api/routers/vector";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  stats: statsRouter,
  settings: settingsRouter,
  vector: vectorRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
