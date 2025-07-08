import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getRoomsRoute: FastifyPluginCallbackZod = async (app) => {
  app.get("/rooms", async () => {
    const result = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        createdAt: schema.rooms.createdAt,
      })
      .from(schema.rooms)
      .orderBy(schema.rooms.createdAt);

    return result;
  });
};
