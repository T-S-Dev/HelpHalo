"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Copy, Edit, ExternalLink, MoreVertical, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_URL } from "@/lib/constants";

import deleteChatbotAction from "@/features/admin/shared/actions/delete-chatbot.action";
import DeleteConfirmationDialog from "@/features/admin/shared/components/DeleteConfirmationDialog";
import { useCopyToClipboard } from "@/features/admin/shared/hooks/useCopyToClipboard";

import type { ChatbotSummary } from "@/types/client";
import { toggleChatbotStatusAction } from "../actions/toggle-chatbots-status.action";

export default function ChatbotCardMenu({ chatbot }: { chatbot: ChatbotSummary }) {
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const [isTogglePending, startToggleTransition] = useTransition();

  const { copyToClipboard } = useCopyToClipboard({ showToast: true });
  const chatbotLink = `${BASE_URL}/chatbot/${chatbot.id}`;

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteChatbotAction(chatbot.id);
      if (result.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleToggle = () => {
    startToggleTransition(async () => {
      const result = await toggleChatbotStatusAction(chatbot.id, chatbot.isActive);
      if (result.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleSessions = () => router.push(`/view-chatbot-sessions/${chatbot.id}`);
  const handleCopy = () => copyToClipboard(chatbotLink);
  const handleView = () => window.open(chatbotLink, "_blank");
  const handleEdit = () => router.push(`/edit-chatbot/${chatbot.id}`);

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
          <DropdownMenuItem disabled={isTogglePending} onClick={handleToggle}>
            <Power className="mr-2 h-4 w-4" />
            Toggle status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isDeletePending}
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
        onDelete={handleDelete}
        resourceName="Chatbot"
        resourceDisplayName={chatbot.name}
        deleteLoading={isDeletePending}
      />
    </>
  );
}
