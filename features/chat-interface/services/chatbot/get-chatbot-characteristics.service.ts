import "server-only";

import { prisma, type PrismaTransactionClient } from "@/shared/lib/prisma";

import type { ChatbotCharacteristic } from "@prisma/client";

export default async function getChatbotCharacteristics(
  chatbotId: string,
  db: PrismaTransactionClient = prisma,
): Promise<Pick<ChatbotCharacteristic, "content">[] | null> {
  const result = await db.chatbot.findUnique({
    where: { id: chatbotId },
    select: {
      characteristics: { select: { content: true } },
    },
  });

  return result?.characteristics ?? null;
}
