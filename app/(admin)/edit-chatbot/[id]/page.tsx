import { notFound } from "next/navigation";

import { tryCatch } from "@/lib/tryCatch";

import getChatbotForEditing from "@/features/admin/chatbot-editor/services/get-chatbot-for-editing.service";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import EditChatbotClient from "./EditChatbotClient";

import type { Chatbot } from "@/types/client";

export default async function EditChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ userId }, { id }] = await Promise.all([getCurrentUser(), params]);
  if (!userId) return notFound();

  const [chatbotData, error] = await tryCatch(getChatbotForEditing(id, userId));

  if (error) return notFound();

  const serializedChatbot: Chatbot = {
    ...chatbotData,
    createdAt: chatbotData.createdAt.toISOString(),
    updatedAt: chatbotData.updatedAt.toISOString(),
    characteristics: chatbotData.characteristics.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  };

  return <EditChatbotClient initialData={serializedChatbot} />;
}
