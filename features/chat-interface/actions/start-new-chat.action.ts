"use server";

import { cookies } from "next/headers";

import { AppError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import createChatSession from "../services/chat/create-chat-session.service";
import createGuest from "../services/chat/create-guest.service";
import insertMessage from "../services/chat/insert-message.service";
import getChatbotOwner from "../services/chatbot/get-chatbot-owner.service";
import { UserInfoSchema } from "../lib/UserInfoSchema";

import type { Action } from "@/types/actions";
import type { Message } from "@/types/client";
import type { UserInfo } from "../lib/UserInfoSchema";

export type StartNewChatResult = {
  chatSessionId: string;
  initialBotMessage: Message;
};

const COOKIE_MAX_AGE = 60 * 60 * 24;

export default async function startNewChatAction(chatbotId: string, data: UserInfo): Action<StartNewChatResult> {
  const validatedFields = UserInfoSchema.safeParse(data);

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError || "Invalid input." };
  }

  const { name, email } = validatedFields.data;

  try {
    const { userId } = await getCurrentUser();

    const { session, initialBotMsg } = await prisma.$transaction(async (tx) => {
      // 1. Determine if the current user is the owner of the chatbot.
      const ownerId = await getChatbotOwner(chatbotId, tx);
      if (!ownerId) throw new NotFoundError("Chatbot not found.");
      const isOwner = userId === ownerId;

      // 2. Create the Guest
      const guest = await createGuest({ name, email }, tx);

      // 3. Create the Chat Session
      const session = await createChatSession({ chatbotId, guestId: guest.id }, isOwner, tx);

      // 4. Insert the initial bot message
      const initialBotMsg = await insertMessage(
        {
          chatSessionId: session.id,
          content: `Hello ${name}! How can I assist you today?`,
          sender: "BOT",
        },
        tx,
      );

      // 5. Set the chat session ID in an HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: `chatSessionId-${chatbotId}`,
        value: session.id,
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      });

      return { session, initialBotMsg };
    });

    const serializedMessage = {
      ...initialBotMsg,
      createdAt: initialBotMsg.createdAt.toISOString(),
      updatedAt: initialBotMsg.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: {
        chatSessionId: session.id,
        initialBotMessage: serializedMessage,
      },
    };
  } catch (error) {
    console.error("Error starting new chat:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
