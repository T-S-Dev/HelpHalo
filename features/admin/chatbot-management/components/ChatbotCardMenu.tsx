"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Copy, Edit, ExternalLink, MoreVertical, Power, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_URL } from "@/graphql/apolloClient";

import DeleteConfirmationDialog from "@/features/admin/shared/components/DeleteConfirmationDialog";
import { useDeleteChatbot, useToggleChatbotStatus } from "@/features/admin/shared/hooks/useChatbotActions";
import { useCopyToClipboard } from "@/features/admin/shared/hooks/useCopyToClipboard";

import type { ChatbotSummary } from "@/types/client";

export default function ChatbotCardMenu({ chatbot }: { chatbot: ChatbotSummary }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { copyToClipboard } = useCopyToClipboard({ showToast: true });
  const chatbotLink = `${BASE_URL}/chatbot/${chatbot.id}`;

  const { deleteChatbot, deleteLoading } = useDeleteChatbot();
  const { toggleStatus, toggleLoading } = useToggleChatbotStatus();

  const handleSessions = () => {
    router.push(`/view-chatbot-sessions/${chatbot.id}`);
  };

  const handleCopy = () => {
    copyToClipboard(chatbotLink);
  };

  const handleView = () => {
    window.open(`/chatbot/${chatbot.id}`, "_blank");
  };

  const handleEdit = () => {
    router.push(`/edit-chatbot/${chatbot.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSessions}>
            <BarChart className="mr-2 h-4 w-4" />
            View Sessions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleView}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={toggleLoading} onClick={() => toggleStatus(chatbot.id, chatbot.isActive)}>
            <Power className="mr-2 h-4 w-4" />
            Toggle status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteLoading}
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-destructive focus:text-destructive focus:bg-destructive/20"
          >
            <Trash2 className="text-destructive mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onDelete={() => deleteChatbot(chatbot.id)}
        resourceName="Chatbot"
        resourceDisplayName={chatbot.name}
        deleteLoading={deleteLoading}
      />
    </>
  );
}
