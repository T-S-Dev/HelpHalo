"use server";

import { revalidatePath } from "next/cache";

import { AppError } from "@/shared/lib/errors";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import deleteCharacteristic from "../services/delete-characteristic.service";

import type { Action } from "@/types/actions";

export default async function deleteCharacteristicAction(
  characteristicId: string,
  chatbotId: string,
): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AppError("Unauthorized");

    await deleteCharacteristic(characteristicId, chatbotId, userId);

    revalidatePath(`/edit-chatbot/${chatbotId}`);
    return { success: true, data: { message: "Successfully delete Characteristic." } };
  } catch (error) {
    console.error("Failed to delete characteristic:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
