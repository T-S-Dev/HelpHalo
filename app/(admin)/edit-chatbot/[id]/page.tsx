import { notFound } from "next/navigation";

import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";
import getChatbotOwner from "@/features/chat-interface/services/chatbot/get-chatbot-owner.service";

import EditChatbotClient from "./EditChatbotClient";

export default async function EditChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ userId }, { id }] = await Promise.all([getCurrentUser(), params]);

  if (!userId) return notFound();

  const ownerId = await getChatbotOwner(id);

  if (userId !== ownerId) return notFound();

  return <EditChatbotClient chatbotId={id} />;
}
