"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { AlertTriangle } from "lucide-react";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/graphql/apolloClient";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries";

import BackToDashboardButton from "@/features/admin/shared/components/BackToDashboardButton";
import DeleteConfirmationDialog from "@/features/admin/shared/components/DeleteConfirmationDialog";
import ErrorAlert from "@/features/admin/shared/components/ErrorAlert";
import ChatbotForm from "@/features/admin/chatbot-editor/components/ChatbotForm/ChatbotForm";
import LinkToChatbot from "@/features/admin/chatbot-editor/components/LinkToChatbot";
import { useDeleteChatbot } from "@/features/admin/shared/hooks/useChatbotActions";

export default function EditChatbotClient({ chatbotId }: { chatbotId: string }) {
  const { data, loading, error } = useQuery(GET_CHATBOT_BY_ID, {
    variables: { id: chatbotId },
  });

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      console.log(error);
      return <ErrorAlert message="Failed to load chatbot data. Please check your connection and try again." />;
    }

    if (!data.chatbot) {
      return <ErrorAlert message="Chatbot not found. It may have been deleted." />;
    }

    return (
      <>
        <LinkToChatbot link={`${BASE_URL}/chatbot/${data.chatbot.id}`} />
        <ChatbotForm isEditing={true} initialData={data.chatbot} />
        <DeleteZone id={data.chatbot.id} name={data.chatbot.name} />
      </>
    );
  };

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

      {renderContent()}
    </div>
  );
}

function DeleteZone({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteChatbot, deleteLoading } = useDeleteChatbot();

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 text-2xl leading-none font-bold tracking-tight">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-destructive/20 border-destructive/40 rounded-lg border p-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-medium">Delete this chatbot</h3>
              <p className="text-muted-foreground mt-1 text-sm">Once deleted, this action cannot be undone.</p>
            </div>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Chatbot
            </Button>
            <DeleteConfirmationDialog
              isOpen={isDeleteModalOpen}
              onCancel={() => setIsDeleteModalOpen(false)}
              onDelete={() => deleteChatbot(id, handleSuccess)}
              resourceName="Chatbot"
              resourceDisplayName={name}
              deleteLoading={deleteLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
