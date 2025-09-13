import "server-only";

import { NotFoundError } from "@/lib/errors";
import { prisma, type PrismaTransactionClient } from "@/lib/prisma";

import type { Message } from "@prisma/client";

export default async function getSessionMessages(
  chatSessionId: string,
  db: PrismaTransactionClient = prisma,
): Promise<Message[]> {
  const session = await db.chatSession.findUnique({
    where: { id: chatSessionId },
    select: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) throw new NotFoundError("Session not found.");

  return session.messages.map((m) => ({
    id: m.id,
    chatSessionId: m.chatSessionId,
    content: m.content,
    sender: m.sender,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));
}
