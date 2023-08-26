import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
    });

    return user;
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        apiKey: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });

      return user;
    }),
});
