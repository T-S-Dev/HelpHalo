import "server-only";

import { prisma, type PrismaTransactionClient } from "@/shared/lib/prisma";

import type { Message } from "@prisma/client";

const MESSAGE_PAGE_SIZE = 25;

export default async function getSessionMessages(
  chatSessionId: string,
  cursor?: string,
  db: PrismaTransactionClient = prisma,
): Promise<{ messages: Message[]; nextCursor: string | null }> {
  const messages = await db.message.findMany({
    where: { chatSessionId },
    take: MESSAGE_PAGE_SIZE,
    // If a cursor is provided, skip the cursor itself and start from the next item
    skip: cursor ? 1 : 0,
    // If a cursor is provided, use it to find where to start fetching
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc", // Fetch newest messages first
    },
  });

  let nextCursor: string | null = null;
  if (messages.length === MESSAGE_PAGE_SIZE) {
    // If we fetched a full page, the last message in the list is the cursor for the next page
    nextCursor = messages[MESSAGE_PAGE_SIZE - 1].id;
  }

  return {
    // Reverse the array to return messages in ascending (oldest first) order for the UI
    messages: messages.reverse(),
    nextCursor,
  };
}
