import "server-only";
import { Prisma } from "@prisma/client";

import { prisma, type PrismaTransactionClient } from "@/shared/lib/prisma";

import type { ChatbotSummary } from "@/types/server";

type GetChatbotsForOwnerResult = {
  chatbots: ChatbotSummary[];
  totalPages: number;
};

const PAGE_SIZE = 9;

export default async function getChatbotsForOwner(
  userId: string,
  query: string,
  status: "all" | "active" | "inactive",
  page: number,
  db: PrismaTransactionClient = prisma,
): Promise<GetChatbotsForOwnerResult> {
  const whereClause: Prisma.ChatbotWhereInput = {
    clerkUserId: userId,
  };

  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (status !== "all") {
    whereClause.isActive = status === "active";
  }

  let chatbotsData;
  let totalCount;

  const findManyArgs = {
    where: whereClause,
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
      isActive: true,
      updatedAt: true,
      _count: { select: { chatSessions: true } },
    },
  } as const;

  const countArgs = { where: whereClause };

  if (db === prisma) {
    [chatbotsData, totalCount] = await prisma.$transaction([
      prisma.chatbot.findMany(findManyArgs),
      prisma.chatbot.count(countArgs),
    ]);
  } else {
    chatbotsData = await db.chatbot.findMany(findManyArgs);
    totalCount = await db.chatbot.count(countArgs);
  }

  const chatbots: ChatbotSummary[] = chatbotsData.map((bot) => ({
    ...bot,
    sessionCount: bot._count.chatSessions,
  }));

  return {
    chatbots,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
  };
}
