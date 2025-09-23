"use server";

import { revalidatePath } from "next/cache";

import { AppError } from "@/lib/errors";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import deleteChatbot from "../services/delete-chatbot.service";

import type { Action } from "@/types/actions";

export default async function deleteChatbotAction(chatbotId: string): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AppError("Unauthorized");

    await deleteChatbot(chatbotId, userId);

    revalidatePath("/dashboard");
    return { success: true, data: { message: "Chatbot deleted successfully." } };
  } catch (error) {
    console.error("Failed to delete chatbot:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
