import "server-only";

import { prisma, type PrismaTransactionClient } from "@/lib/prisma";

import type { Guest } from "@prisma/client";

export default async function createGuest(
  data: { name: string; email: string },
  db: PrismaTransactionClient = prisma,
): Promise<Guest> {
  return db.guest.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });
}
