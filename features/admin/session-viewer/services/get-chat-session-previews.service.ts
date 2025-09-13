import "server-only";
import { Prisma } from "@prisma/client";

import { NotFoundError } from "@/shared/lib/errors";
import { prisma, type PrismaTransactionClient } from "@/shared/lib/prisma";

import type { ChatbotSessionSummary } from "@/types/server";

export type GetChatSessionPreviewsResult = {
  chatbotName: string;
  sessions: ChatbotSessionSummary[];
  totalPages: number;
};

const PAGE_SIZE = 12;

export default async function getChatSessionPreviews(
  chatbotId: string,
  userId: string,
  query: string,
  page: number,
  db: PrismaTransactionClient = prisma,
): Promise<GetChatSessionPreviewsResult> {
  const sanitizedPage = Math.max(Number(page) || 1, 1);

  const bot = await db.chatbot
    .findFirstOrThrow({
      where: {
        id: chatbotId,
        clerkUserId: userId,
      },
      select: { name: true },
    })
    .catch(() => {
      throw new NotFoundError("Chatbot not found");
    });

  const whereClause: Prisma.ChatSessionWhereInput = {
    chatbotId: chatbotId,
  };

  if (query) {
    whereClause.OR = [
      { guest: { name: { contains: query, mode: "insensitive" } } },
      { guest: { email: { contains: query, mode: "insensitive" } } },
    ];
  }

  let sessionsData;
  let totalCount;

  const findManyArgs = {
    where: whereClause,
    take: PAGE_SIZE,
    skip: (sanitizedPage - 1) * PAGE_SIZE,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      guest: { select: { name: true, email: true } },
      _count: { select: { messages: true } },
      messages: { take: 1, orderBy: { createdAt: "desc" }, select: { content: true, createdAt: true } },
      updatedAt: true,
    },
  } as const;

  const countArgs = { where: whereClause };

  if (db === prisma) {
    [sessionsData, totalCount] = await prisma.$transaction([
      prisma.chatSession.findMany(findManyArgs),
      prisma.chatSession.count(countArgs),
    ]);
  } else {
    sessionsData = await db.chatSession.findMany(findManyArgs);
    totalCount = await db.chatSession.count(countArgs);
  }

  const sessions: ChatbotSessionSummary[] = sessionsData.map((s) => {
    const lastMessageTime = s.messages[0]?.createdAt ?? s.updatedAt;
    const startTime = s.createdAt;
    return {
      id: s.id,
      chatbotId,
      guest: s.guest,
      messageCount: s._count.messages,
      lastMessage: s.messages[0]?.content ?? "",
      lastAt: s.messages[0]?.createdAt ?? s.updatedAt,
      duration: lastMessageTime.getTime() - startTime.getTime(),
    };
  });

  return {
    chatbotName: bot.name,
    sessions,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
  };
}
