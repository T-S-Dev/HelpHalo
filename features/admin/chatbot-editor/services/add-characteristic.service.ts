import "server-only";

import { prisma } from "@/lib/prisma";

import verifyChatbotOwnership from "@/features/admin/shared/services/verify-chatbot-ownership.service";

import type { ChatbotCharacteristic } from "@prisma/client";

export default async function addCharacteristic(
  chatbotId: string,
  userId: string,
  content: string,
): Promise<ChatbotCharacteristic> {
  await verifyChatbotOwnership(chatbotId, userId);

  const [newCharacteristic] = await prisma.$transaction([
    prisma.chatbotCharacteristic.create({
      data: { content, chatbotId },
    }),
    prisma.chatbot.update({
      where: { id: chatbotId },
      data: { updatedAt: new Date() },
    }),
  ]);

  return newCharacteristic;
}
