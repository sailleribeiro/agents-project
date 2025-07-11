import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";
import { generateAnswer, generateEmbedding } from "../../services/gemini.ts";
import { and, eq, sql } from "drizzle-orm";

export const createQuestionRoute: FastifyPluginCallbackZod = async (app) => {
  app.post(
    "/room/:roomId/questions",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      const embedding = await generateEmbedding(question);

      if (!embedding) {
        return reply
          .status(400)
          .send({ error: "Failed to generate embedding for the question" });
      }

      const embeddingAsString = `[${embedding.join(",")}]`;

      const chunks = await db
        .select({
          id: schema.audiChunks.id,
          roomId: schema.audiChunks.roomId,
          transcription: schema.audiChunks.transcription,
          similarity: sql<number>`1 - (${schema.audiChunks.embedding} <=> ${embeddingAsString}::vector)`,
        })
        .from(schema.audiChunks)
        .where(
          and(
            eq(schema.audiChunks.roomId, roomId),
            sql`1 - (${schema.audiChunks.embedding} <=> ${embeddingAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`(${schema.audiChunks.embedding} <=> ${embeddingAsString}::vector)`
        )
        .limit(3);

      let answer: string | null = null;

      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription);
        answer = await generateAnswer(question, transcriptions);
      }

      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
          answer,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create question");
      }

      return reply.status(201).send({
        id: result[0].id,
        roomId: result[0].roomId,
        question: result[0].question,
        answer: result[0].answer,
      });
    }
  );
};
