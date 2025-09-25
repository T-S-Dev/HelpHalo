import "server-only";
import { prisma } from "@/lib/prisma";

import { NotFoundError, ValidationError } from "@/lib/errors";

import verifyChatbotOwnership from "@/features/admin/shared/services/verify-chatbot-ownership.service";

export default async function deleteChatSessions(sessionIds: string[], userId: string) {
  if (sessionIds.length === 0) {
    throw new ValidationError("No sessions were selected for deletion.");
  }

  const sessionsToDelete = await prisma.chatSession.findMany({
    where: {
      id: { in: sessionIds },
    },
    select: { guestId: true, chatbotId: true },
  });

  if (sessionsToDelete.length === 0) {
    throw new NotFoundError("One or more sessions not found.");
  }

  // 2. Verify that all sessions belong to the same parent chatbot.
  const firstChatbotId = sessionsToDelete[0].chatbotId;
  const allSessionsBelongToSameBot = sessionsToDelete.every((s) => s.chatbotId === firstChatbotId);

  if (!allSessionsBelongToSameBot) {
    throw new ValidationError("Sessions from multiple chatbots cannot be deleted at once.");
  }

  // 3. Verify the user owns the parent chatbot of these sessions.
  await verifyChatbotOwnership(firstChatbotId, userId);

  // 4. Collect all the unique guest IDs to be deleted.
  const guestIdsToDelete = [...new Set(sessionsToDelete.map((s) => s.guestId))];

  // Delete the guests, the `onDelete: Cascade` in the schema will handle deleting the sessions and messages.
  const { count } = await prisma.guest.deleteMany({
    where: {
      id: { in: guestIdsToDelete },
    },
  });

  return { count, chatbotId: firstChatbotId };
}
