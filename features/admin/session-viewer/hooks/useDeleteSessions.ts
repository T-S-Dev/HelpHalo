import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { ChatbotSessionSummary } from "@/types/client";
import deleteChatSessionsAction from "../actions/delete-sessions.action";

type Props = {
  sessions: ChatbotSessionSummary[];
  selectedIds: string[];
  onDeleteSuccess: () => void;
};

type DeleteTarget = {
  ids: string[];
  displayName: string;
};

export function useDeleteSessions({ sessions, selectedIds, onDeleteSuccess }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDeleteDialog = (target: DeleteTarget) => {
    setDeleteTarget(target);
    setIsDeleteDialogOpen(true);
  };

  const handleSingleDelete = (session: ChatbotSessionSummary) => {
    openDeleteDialog({
      ids: [session.id],
      displayName: session.guest?.email || "Unknown",
    });
  };

  const handleMultiDelete = () => {
    if (selectedIds.length === 0) return;

    if (selectedIds.length === 1) {
      const session = sessions.find((s) => s.id === selectedIds[0]);
      if (session) handleSingleDelete(session);
      return;
    }

    openDeleteDialog({
      ids: selectedIds,
      displayName: `${selectedIds.length} sessions`,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteChatSessionsAction(deleteTarget.ids);

      if (result.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.error);
      }

      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      onDeleteSuccess();
    });
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteTarget,
    isPending,
    handleSingleDelete,
    handleMultiDelete,
    handleConfirmDelete,
  };
}
