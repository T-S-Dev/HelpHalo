import "server-only";

import { prisma, type PrismaTransactionClient } from "@/shared/lib/prisma";

export default async function getChatbotOwner(
  chatbotId: string,
  db: PrismaTransactionClient = prisma,
): Promise<string | null> {
  const chatbot = await db.chatbot.findUnique({
    where: { id: chatbotId },
    select: { clerkUserId: true },
  });

  return chatbot?.clerkUserId ?? null;
}
