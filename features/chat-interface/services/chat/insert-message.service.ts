import "server-only";

import { prisma, type PrismaTransactionClient } from "@/lib/prisma";

import type { Message, Sender } from "@prisma/client";

type InsertMessageData = {
  chatSessionId: string;
  content: string;
  sender: Sender;
};

export default async function insertMessage(
  data: InsertMessageData,
  db: PrismaTransactionClient = prisma,
): Promise<Message> {
  let newMessage;

  if (db === prisma) {
    [newMessage] = await prisma.$transaction([
      db.message.create({ data }),
      db.chatSession.update({
        where: { id: data.chatSessionId },
        data: { updatedAt: new Date() },
      }),
    ]);
  } else {
    newMessage = await db.message.create({ data });
    await db.chatSession.update({
      where: { id: data.chatSessionId },
      data: { updatedAt: new Date() },
    });
  }

  return newMessage;
}
