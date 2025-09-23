import "server-only";

import { prisma } from "@/lib/prisma";

import type { Chatbot } from "@prisma/client";
import type { ChatbotBasicInfo } from "../lib/ChatbotBasicInfoSchema";

export default async function createChatbot(data: ChatbotBasicInfo, userId: string): Promise<Chatbot> {
  return await prisma.chatbot.create({
    data: {
      ...data,
      clerkUserId: userId,
    },
  });
}
