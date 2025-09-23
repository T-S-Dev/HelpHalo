import "server-only";

import { prisma } from "@/lib/prisma";

import verifyChatbotOwnership from "./verify-chatbot-ownership.service";

import type { Chatbot } from "@prisma/client";

export default async function deleteChatbot(chatbotId: string, userId: string): Promise<Chatbot> {
  await verifyChatbotOwnership(chatbotId, userId);

  const deletedChatbot = await prisma.chatbot.delete({
    where: { id: chatbotId },
  });

  return deletedChatbot;
}
