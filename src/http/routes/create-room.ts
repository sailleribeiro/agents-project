import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";

export const createRoom: FastifyPluginCallbackZod = async (app) => {
  app.post(
    "/room",
    {
      schema: {
        body: z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { name, description } = request.body;
      const result = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create room");
      }

      return reply.status(201).send({
        roomId: result[0].id,
      });
    }
  );
};
