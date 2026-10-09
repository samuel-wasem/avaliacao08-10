import Fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { cardRoutes } from "./routes/cards";
import { deckRoutes } from "./routes/decks";

export const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Dados inválidos",
      issues: error.validation,
    });
  }

  return reply.send(error);
});

app.register(deckRoutes);
app.register(cardRoutes);

async function start() {
  try {
    await app.listen({ port: 3333, host: "127.0.0.1" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  void start();
}