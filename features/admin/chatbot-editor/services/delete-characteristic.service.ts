import "server-only";

import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

import verifyChatbotOwnership from "@/features/admin/shared/services/verify-chatbot-ownership.service";

export default async function deleteCharacteristic(characteristicId: string, chatbotId: string, userId: string): Promise<void> {
  await verifyChatbotOwnership(chatbotId, userId);

  const characteristic = await prisma.chatbotCharacteristic.findUnique({
    where: { id: characteristicId },
    select: { id: true },
  });

  if (!characteristic) {
    throw new NotFoundError("Characteristic not found.");
  }

  await prisma.$transaction([
    prisma.chatbotCharacteristic.delete({ where: { id: characteristicId } }),
    prisma.chatbot.update({
      where: { id: chatbotId },
      data: { updatedAt: new Date() },
    }),
  ]);
}
