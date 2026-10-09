import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });
const createCardSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(1),
  deckId: z.number().int().positive(),
});
const reviewSchema = z.object({ grade: z.number().int().min(1).max(5) });

const deckInclude = {
  deck: { select: { id: true, name: true } },
} as const;

export async function cardRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.route({
    method: "POST",
    url: "/cards",
    schema: { body: createCardSchema },
    async handler(request, reply) {
      const { question, answer, deckId } = request.body;
      const deck = await prisma.deck.findUnique({ where: { id: deckId } });
      if (!deck) {
        return reply.status(404).send({ message: "Baralho não encontrado" });
      }

      const created = await prisma.card.create({
        data: { deckId, question, answer },
      });
      return reply.status(201).send(created);
    },
  });

  server.route({
    method: "GET",
    url: "/cards",
    async handler(_request, reply) {
      const result = await prisma.card.findMany({
        orderBy: { id: "asc" },
        include: deckInclude,
      });
      return reply.status(200).send(result);
    },
  });

  server.route({
    method: "GET",
    url: "/cards/:id",
    schema: { params: paramsSchema },
    async handler(request, reply) {
      const result = await prisma.card.findUnique({
        where: { id: request.params.id },
        include: deckInclude,
      });
      if (!result) {
        return reply.status(404).send({ message: "Card não encontrado" });
      }
      return reply.status(200).send(result);
    },
  });

  server.route({
    method: "DELETE",
    url: "/cards/:id",
    schema: { params: paramsSchema },
    async handler(request, reply) {
      const { id } = request.params;
      const result = await prisma.card.findUnique({ where: { id } });
      if (!result) {
        return reply.status(404).send({ message: "Card não encontrado" });
      }

      await prisma.card.delete({ where: { id } });
      return reply.status(200).send({ message: "Card removido com sucesso" });
    },
  });

  server.route({
    method: "POST",
    url: "/cards/:id/review",
    schema: { params: paramsSchema, body: reviewSchema },
    async handler(request, reply) {
      const { id } = request.params;
      const { grade } = request.body;
      const existing = await prisma.card.findUnique({ where: { id } });
      if (!existing) {
        return reply.status(404).send({ message: "Card não encontrado" });
      }

      const result = await prisma.card.update({
        where: { id },
        data: {
          reviewCount: { increment: 1 },
          lastGrade: grade,
          lastReviewedAt: new Date(),
        },
      });
      return reply.status(200).send(result);
    },
  });
}
