import "server-only";

import { prisma } from "@/lib/prisma";

import type { Message } from "@prisma/client";

export type MessageHistory = Pick<Message, "sender" | "content">[];

export default async function getSessionHistoryForAI(chatSessionId: string): Promise<MessageHistory> {
  const session = await prisma.chatSession.findUnique({
    where: { id: chatSessionId },
    select: {
      messages: {
        select: {
          sender: true,
          content: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return session?.messages ?? [];
}
