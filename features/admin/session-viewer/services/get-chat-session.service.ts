import "server-only";
import { Prisma } from "@prisma/client";

import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const chatSessionWithLeanRelations = Prisma.validator<Prisma.ChatSessionDefaultArgs>()({
  select: {
    createdAt: true,
    updatedAt: true,
    messages: { orderBy: { createdAt: "asc" } },
    guest: {
      select: {
        name: true,
        email: true,
      },
    },
    chatbot: {
      select: {
        name: true,
      },
    },
  },
});

export type LeanChatSession = Prisma.ChatSessionGetPayload<typeof chatSessionWithLeanRelations>;

export default async function getChatSession(sessionId: string, userId: string): Promise<LeanChatSession> {
  const session = await prisma.chatSession
    .findFirstOrThrow({
      where: {
        id: sessionId,
        chatbot: { clerkUserId: userId },
      },
      select: chatSessionWithLeanRelations.select,
    })
    .catch(() => {
      throw new NotFoundError("Chatbot session not found");
    });

  return session;
}
