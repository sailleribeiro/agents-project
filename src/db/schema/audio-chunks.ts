import { pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.ts";

export const audiChunks = pgTable("audio-chunks", {
  id: uuid().primaryKey().defaultRandom(),
  roomId: uuid()
    .references(() => rooms.id)
    .notNull(),
  transcription: text().notNull(),
  embedding: vector({ dimensions: 768 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
