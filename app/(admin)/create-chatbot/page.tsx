import BackToDashboardButton from "@/features/admin/shared/components/BackToDashboardButton";
import ChatbotForm from "@/features/admin/chatbot-editor/components/ChatbotForm/ChatbotForm";

export default function CreateChatbotPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <BackToDashboardButton />
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight">Create New Chatbot</h1>
          <p className="text-muted-foreground mt-1">Configure your new custom AI assistant</p>
        </div>
      </div>

      {/* Chatbot Form */}
      <div className="mx-auto max-w-4xl">
        <ChatbotForm isEditing={false} />
      </div>
    </div>
  );
}
