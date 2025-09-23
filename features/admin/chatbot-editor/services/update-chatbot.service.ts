import "server-only";

import { prisma } from "@/lib/prisma";

import verifyChatbotOwnership from "../../shared/services/verify-chatbot-ownership.service";

import type { Chatbot } from "@prisma/client";
import type { ChatbotBasicInfo } from "../lib/ChatbotBasicInfoSchema";

export default async function updateChatbot(
  chatbotId: string,
  userId: string,
  data: Partial<ChatbotBasicInfo>,
): Promise<Chatbot> {
  await verifyChatbotOwnership(chatbotId, userId);

  return await prisma.chatbot.update({
    where: { id: chatbotId },
    data: data,
  });
}
