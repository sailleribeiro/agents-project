import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifyCors } from "@fastify/cors";
import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.withTypeProvider<ZodTypeProvider>();

app.get("/health", () => {
  return { status: "ok" };
});

app.register(getRoomsRoute);

app.listen({ port: env.PORT }).then(() => {
  console.log(`JA POSSO COLOCAR NO CURRICULO? :${env.PORT}`);
});
