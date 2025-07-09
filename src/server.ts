import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifyCors } from "@fastify/cors";
import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { createRoom } from "./http/routes/create-room.ts";
import { getRoomQuestions } from "./http/routes/get-room-questions.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.withTypeProvider<ZodTypeProvider>();

app.get("/health", () => {
  return { status: 200, message: "OK" };
});

app.register(getRoomsRoute);
app.register(createRoom);
app.register(getRoomQuestions);
app.register(createQuestionRoute);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running, PORT: ${env.PORT}`);
});
