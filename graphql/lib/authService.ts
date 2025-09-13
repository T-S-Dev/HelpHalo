import { AuthorizationError, NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";
import { GraphQLContext } from "@/types/server";

function verifyUserIsAuthenticated(context: GraphQLContext) {
  if (!context.userId) {
    throw new AuthorizationError("Unauthorized: User not authenticated.");
  }
}

export async function verifyChatbotOwnership(context: GraphQLContext, chatbotId: string) {
  verifyUserIsAuthenticated(context);

  const chatbot = await prisma.chatbot.findUnique({
    where: { id: chatbotId },
    select: { clerkUserId: true },
  });

  if (!chatbot) {
    throw new NotFoundError("Chatbot not found.");
  }

  if (chatbot.clerkUserId !== context.userId) {
    throw new AuthorizationError("Unauthorized: You do not own this chatbot.");
  }
}

export async function verifyCharacteristicOwnership(context: GraphQLContext, characteristicId: string) {
  verifyUserIsAuthenticated(context);

  const characteristic = await prisma.chatbotCharacteristic.findUnique({
    where: { id: characteristicId },
    select: { chatbot: { select: { clerkUserId: true } } },
  });

  if (!characteristic) {
    throw new NotFoundError("Characteristic not found.");
  }

  if (characteristic.chatbot.clerkUserId !== context.userId) {
    throw new AuthorizationError("Unauthorized: You do not own this chatbot.");
  }
}
