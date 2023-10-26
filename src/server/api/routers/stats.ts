import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const statsRouter = createTRPCRouter({
  getRequestsRaw: protectedProcedure
    .input(
      z.object({ skip: z.number().optional(), take: z.number().optional() })
    )
    .query(async ({ input, ctx }) => {
      return await prisma.request.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: input.skip,
        take: input.take,
      });
    }),

  getModelRequests: protectedProcedure
    .input(
      z.object({
        timezone: z.string(),
        interval: z.enum(["1h", "24h", "7d", "30d", "90d", "all"]),
      })
    )
    .query(async ({ input, ctx }) => {
      const intervalData = {
        "1h": {
          startDate: new Date(Date.now() - 3600000),
          granularity: "minute",
        },
        "24h": {
          startDate: new Date(Date.now() - 86400000),
          granularity: "hour",
        },
        "7d": {
          startDate: new Date(Date.now() - 604800000),
          granularity: "day",
        },
        "30d": {
          startDate: new Date(Date.now() - 2592000000),
          granularity: "day",
        },
        "90d": {
          startDate: new Date(Date.now() - 7776000000),
          granularity: "month",
        },
        all: {
          // Dub.sh founding date
          startDate: new Date("2022-09-22"),
          granularity: "month",
        },
      };

      let url = new URL(
        "https://api.us-east.tinybird.co/v0/pipes/requests_by_model.json"
      );

      url.searchParams.append(
        "start",
        intervalData[input.interval].startDate
          .toISOString()
          .replace("T", " ")
          .replace("Z", "")
      );
      url.searchParams.append(
        "end",
        new Date(Date.now()).toISOString().replace("T", " ").replace("Z", "")
      );

      url.searchParams.append(
        "granularity",
        intervalData[input.interval].granularity
      );

      url.searchParams.append("userid", ctx.session.user.id);

      url.searchParams.append("timezone", input.timezone);

      const data = await fetch(url, {
        headers: {
          Authorization: `Bearer ${env.TINYBIRD_API_KEY}`,
        },
        cache: "no-store",
      });

      const ret = (await data.json()) as RequestsDataJson;

      return ret;
    }),
});

type Meta = {
  name: string;
  type: string;
};

type Data = {
  timebucket: string;
  "gpt-3.5-turbo": number;
  "gpt-4": number;
  total: number;
};

type Statistics = {
  elapsed: number;
  rows_read: number;
  bytes_read: number;
};

export type RequestsDataJson = {
  meta: Meta[];
  data: Data[];
  rows: number;
  rows_before_limit_at_least: number;
  statistics: Statistics;
};
