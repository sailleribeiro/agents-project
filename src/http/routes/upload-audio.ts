import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

import z from "zod/v4";
import { generateEmbedding, transcribeAudio } from "../../services/gemini.ts";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = async (app) => {
  app.post(
    "/room/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        return reply.status(400).send({ error: "No audio file uploaded" });
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");
      const mimeType = audio.mimetype;

      const transcription = await transcribeAudio(audioAsBase64, mimeType);
      const embedding = await generateEmbedding(transcription);

      if (!embedding) {
        throw new Error("Embedding is required but was undefined");
      }

      const result = await db
        .insert(schema.audiChunks)
        .values({
          roomId,
          transcription,
          embedding,
        })
        .returning();

      const chunk = result[0];
      if (!chunk) {
        return reply.status(500).send({ error: "Failed to save audio chunk" });
      }

      return reply.status(201).send({
        id: chunk.id,
        roomId: chunk.roomId,
        transcription: chunk.transcription,
        embedding: chunk.embedding,
        createdAt: chunk.createdAt,
      });
    }
  );
};
