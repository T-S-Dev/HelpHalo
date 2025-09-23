"use server";

import { revalidatePath } from "next/cache";

import { AppError, AuthorizationError } from "@/shared/lib/errors";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import addCharacteristic from "../services/add-characteristic.service";

import type { Action } from "@/types/actions";
import type { ChatbotCharacteristic } from "@/types/client";

export default async function addCharacteristicAction(
  chatbotId: string,
  content: string,
): Action<{ newCharacteristic: ChatbotCharacteristic; message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AuthorizationError("Unauthorized");
    if (!content.trim()) return { success: false, error: "Content cannot be empty." };

    const newCharacteristic = await addCharacteristic(chatbotId, userId, content);

    const serializedCharacteristic: ChatbotCharacteristic = {
      ...newCharacteristic,
      createdAt: newCharacteristic.createdAt.toISOString(),
      updatedAt: newCharacteristic.updatedAt.toISOString(),
    };

    revalidatePath(`/edit-chatbot/${chatbotId}`);
    return {
      success: true,
      data: { newCharacteristic: serializedCharacteristic, message: "Characteristic added successfully." },
    };
  } catch (error) {
    console.error("Failed to add characteristic:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
