import OpenAI from "openai";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "~/server/db";
import { createDocContextSchema } from "~/app/dashboard/spells/types";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);

export const vectorRouter = createTRPCRouter({
  deleteDocContext: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await prisma.documentContext.deleteMany({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
  docContexts: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.documentContext.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        document: true,
      },
    });
  }),
  docContext: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await prisma.documentContext.findFirstOrThrow({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
        include: {
          document: {
            include: {
              snippets: true,
            },
          },
        },
      });
    }),
  createDoc: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        contextId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Check if context belongs to user
      const context = await prisma.documentContext.findFirstOrThrow({
        where: {
          id: input.contextId,
          userId: ctx.session.user.id,
        },
      });

      const doc = await prisma.document.create({
        data: {
          name: input.name,
          content: input.content.slice(0, context.chunkSize),
          contextId: input.contextId,
        },
      });

      function chunkString(str: string, length: number): string[] {
        const words = str.split(" ");
        const chunks: string[] = [];
        let currentChunk = "";

        for (const word of words) {
          if (currentChunk.length + word.length + 1 <= length) {
            currentChunk += word + " ";
          } else {
            chunks.push(currentChunk.trim());
            currentChunk = word + " ";
          }
        }

        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
        }

        return chunks;
      }

      const chunks = chunkString(input.content, context.chunkSize);

      async function embedChunk(chunk: string) {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: input.content,
        });

        if (!embeddingResponse.data[0]?.embedding)
          throw new Error("No embedding found");

        const embedding = embeddingResponse.data[0].embedding;

        await supabaseClient.from("Snippet").insert({
          content: chunk,
          userId: ctx.session.user.id,
          documentId: doc.id,
          embedding,
        });
      }

      await Promise.allSettled(chunks.map(embedChunk));
    }),
  createDocContext: protectedProcedure
    .input(createDocContextSchema)
    .mutation(async ({ input, ctx }) => {
      await prisma.documentContext.create({
        data: {
          name: input.name,
          chunkSize: input.chunkSize,
          userId: ctx.session.user.id,
        },
      });
    }),
  insertTextEmbedding: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {}),
});
