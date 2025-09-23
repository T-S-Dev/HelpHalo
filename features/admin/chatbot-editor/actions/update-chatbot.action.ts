"use server";

import { revalidatePath } from "next/cache";

import { AppError } from "@/shared/lib/errors";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import updateChatbot from "../services/update-chatbot.service";
import { ChatbotBasicInfoSchema } from "../lib/ChatbotBasicInfoSchema";

import type { Action } from "@/types/actions";
import type { ChatbotBasicInfo } from "../lib/ChatbotBasicInfoSchema";

export default async function updateChatbotAction(
  chatbotId: string,
  data: ChatbotBasicInfo,
): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AppError("Unauthorized");

    const validatedData = ChatbotBasicInfoSchema.partial().parse(data);

    await updateChatbot(chatbotId, userId, validatedData);

    revalidatePath(`/edit-chatbot/${chatbotId}`);
    revalidatePath("/dashboard");
    return { success: true, data: { message: "Chatbot updated successfully." } };
  } catch (error) {
    console.error("Failed to update chatbot:", error);

    const message = error instanceof Error ? error.message : "Failed to update chatbot.";
    return { success: false, error: message };
  }
}
