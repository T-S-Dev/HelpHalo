"use server";

import { revalidatePath } from "next/cache";

import { AppError } from "@/shared/lib/errors";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import toggleChatbotStatus from "../services/toggle-chatbot-status.service";

import type { Action } from "@/types/actions";

export async function toggleChatbotStatusAction(
  chatbotId: string,
  currentStatus: boolean,
): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AppError("Unauthorized");

    await toggleChatbotStatus(chatbotId, userId, currentStatus);

    revalidatePath("/dashboard");
    return { success: true, data: { message: "Status toggled successfully." } };
  } catch (error) {
    console.error("Failed to toggle status:", error);
    const message = error instanceof AppError ? error.message : "Failed to toggle status.";
    return { success: false, error: message };
  }
}
