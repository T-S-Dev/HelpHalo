"use server";

import { cookies } from "next/headers";

export default async function clearChatSessionAction(chatbotId: string) {
  (await cookies()).delete(`chatSessionId-${chatbotId}`);
}
