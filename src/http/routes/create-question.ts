import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";

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

      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create question");
      }

      return reply.status(201).send({
        questionId: result[0].id,
      });
    }
  );
};
