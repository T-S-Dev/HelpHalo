"use server";

import { revalidatePath } from "next/cache";

import { AppError } from "@/shared/lib/errors";

import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import deleteChatSessions from "../services/delete-sessions.service";

import type { Action } from "@/types/actions";

export default async function deleteChatSessionsAction(
  sessionIds: string[],
): Action<{ count: number; message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AppError("Unauthorized");

    const { count, chatbotId } = await deleteChatSessions(sessionIds, userId);

    revalidatePath(`/view-chatbot-sessions/${chatbotId}`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      data: {
        count,
        message: `${count} session${count !== 1 ? "s" : ""} deleted successfully.`,
      },
    };
  } catch (error) {
    console.error("Failed to delete chat sessions:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
