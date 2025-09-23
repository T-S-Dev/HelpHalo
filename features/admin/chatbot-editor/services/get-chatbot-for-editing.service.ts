import "server-only";

import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

import type { Chatbot, ChatbotCharacteristic } from "@prisma/client";

export type ChatbotWithCharacteristics = Chatbot & {
  characteristics: ChatbotCharacteristic[];
};

export default async function getChatbotForEditing(id: string, userId: string): Promise<ChatbotWithCharacteristics> {
  const chatbot = await prisma.chatbot.findUnique({
    where: {
      id: id,
      clerkUserId: userId,
    },
    include: {
      characteristics: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!chatbot) throw new NotFoundError("Chatbot not found or you do not have permission to edit it.");

  return chatbot;
}
