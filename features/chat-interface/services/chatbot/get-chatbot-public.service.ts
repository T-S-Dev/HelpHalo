import "server-only";

import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma, type PrismaTransactionClient } from "@/shared/lib/prisma";

import type { ChatbotPublic } from "@/types/shared";

export default async function getChatbotPublic(
  id: string,
  requestingUserId?: string,
  db: PrismaTransactionClient = prisma,
): Promise<ChatbotPublic> {
  const bot = await db.chatbot.findUnique({
    where: { id },
    select: {
      id: true,
      icon: true,
      name: true,
      isActive: true,
      clerkUserId: true,
    },
  });

  if (!bot) throw new NotFoundError("Chatbot not found.");

  if (!bot.isActive && bot.clerkUserId !== requestingUserId)
    throw new ValidationError("This chatbot is currently not active and cannot be viewed.");

  return {
    id: bot.id,
    icon: bot.icon,
    name: bot.name,
  };
}
