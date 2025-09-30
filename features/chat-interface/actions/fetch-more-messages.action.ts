"use server";

import getSessionMessages from "../services/chat/get-session-messages.service";
import { AppError } from "@/lib/errors";
import type { Action } from "@/types/actions";
import type { Message } from "@/types/client";

type FetchMoreResult = {
  messages: Message[];
  nextCursor: string | null;
};

export default async function fetchMoreMessagesAction(chatSessionId: string, cursor: string): Action<FetchMoreResult> {
  try {
    const result = await getSessionMessages(chatSessionId, cursor);

    const serializedMessages = result.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        messages: serializedMessages,
        nextCursor: result.nextCursor,
      },
    };
  } catch (error) {
    console.error("Failed to fetch more messages:", error);
    const message = error instanceof AppError ? error.message : "Failed to load older messages.";
    return { success: false, error: message };
  }
}
