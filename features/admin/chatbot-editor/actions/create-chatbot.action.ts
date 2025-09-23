"use server";

import { revalidatePath } from "next/cache";

import { AppError, AuthorizationError } from "@/shared/lib/errors";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import { ChatbotBasicInfoSchema } from "../lib/ChatbotBasicInfoSchema";
import createChatbot from "../services/create-chatbot.service";

import type { Action } from "@/types/actions";
import type { ChatbotBasicInfo } from "../lib/ChatbotBasicInfoSchema";

export default async function createChatbotAction(
  data: ChatbotBasicInfo,
): Action<{ message: string; newChatbotId: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AuthorizationError("Unauthorized");

    const validatedData = ChatbotBasicInfoSchema.parse(data);

    const newChatbot = await createChatbot(validatedData, userId);

    revalidatePath("/dashboard");
    return { success: true, data: { message: "Chatbot created successfully.", newChatbotId: newChatbot.id } };
  } catch (error) {
    console.error("Failed to create chatbot:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
