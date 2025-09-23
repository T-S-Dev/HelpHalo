"use client";

import { BASE_URL } from "@/shared/lib/constants";

import BackToDashboardButton from "@/features/admin/shared/components/BackToDashboardButton";
import ChatbotForm from "@/features/admin/chatbot-editor/components/ChatbotForm/ChatbotForm";
import DeleteZone from "@/features/admin/chatbot-editor/components/DeleteZone";
import LinkToChatbot from "@/features/admin/chatbot-editor/components/LinkToChatbot";

import { Chatbot } from "@/types/client";

export default function EditChatbotClient({ initialData }: { initialData: Chatbot }) {
  return (
    <div className="container mx-auto flex max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div>
        <BackToDashboardButton />
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight">Edit Chatbot</h1>
          <p className="text-muted-foreground mt-1">Update your chatbot&apos;s configuration and behavior</p>
        </div>
      </div>

      <LinkToChatbot link={`${BASE_URL}/chatbot/${initialData.id}`} />
      <ChatbotForm key={initialData.id} isEditing={true} initialData={initialData} />
      <DeleteZone id={initialData.id} name={initialData.name} />
    </div>
  );
}
