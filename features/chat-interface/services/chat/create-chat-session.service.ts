import "server-only";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { prisma, type PrismaTransactionClient } from "@/lib/prisma";

import type { ChatSession } from "@prisma/client";

export default async function createChatSession(
  data: { chatbotId: string; guestId: string },
  isOwner: boolean = false,
  db: PrismaTransactionClient = prisma,
): Promise<ChatSession> {
  const bot = await db.chatbot.findUnique({
    where: { id: data.chatbotId },
    select: { isActive: true },
  });

  if (!bot) {
    throw new NotFoundError("Chatbot not found.");
  }

  if (!bot.isActive && !isOwner) {
    throw new ValidationError("This chatbot is currently not active.");
  }

  return db.chatSession.create({
    data: {
      chatbotId: data.chatbotId,
      guestId: data.guestId,
    },
  });
}
