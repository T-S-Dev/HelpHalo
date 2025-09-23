import "server-only";

import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export default async function verifyChatbotOwnership(chatbotId: string, userId: string) {
  const chatbot = await prisma.chatbot.findUnique({
    where: { id: chatbotId, clerkUserId: userId },
    select: { id: true },
  });
  if (!chatbot) {
    throw new NotFoundError("Chatbot not found or you do not have permission.");
  }
}
