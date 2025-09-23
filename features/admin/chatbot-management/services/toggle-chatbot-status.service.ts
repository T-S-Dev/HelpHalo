import "server-only";

import { prisma } from "@/lib/prisma";

import verifyChatbotOwnership from "@/features/admin/shared/services/verify-chatbot-ownership.service";

import type { Chatbot } from "@prisma/client";

export default async function toggleChatbotStatus(
  chatbotId: string,
  userId: string,
  currentStatus: boolean,
): Promise<Chatbot> {
  await verifyChatbotOwnership(chatbotId, userId);

  return await prisma.chatbot.update({
    where: { id: chatbotId },
    data: { isActive: !currentStatus },
  });
}
