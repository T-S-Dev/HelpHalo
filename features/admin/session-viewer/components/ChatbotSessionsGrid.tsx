"use client";

import { Button } from "@/components/ui/button";
import SearchInput from "@/features/admin/shared/components/SearchInput";
import DeleteConfirmationDialog from "@/features/admin/shared/components/DeleteConfirmationDialog";

import SessionCard from "./ChatbotSessionCard";
import { useSearchQuery } from "../../shared/hooks/useSearchQuery";
import { useMultiSelect } from "../hooks/useMultiSelect";
import { useDeleteSessions } from "../hooks/useDeleteSessions";

import type { ChatbotSessionSummary } from "@/types/client";

export default function ChatbotSessionsGrid({ sessions }: { sessions: ChatbotSessionSummary[] }) {
  const { query, inputValue, handleInputChange } = useSearchQuery();

  const { isSelectMode, setIsSelectMode, selectedIds, setSelectedIds, toggleSelection, clearSelection } =
    useMultiSelect();

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteTarget,
    isPending,
    handleSingleDelete,
    handleMultiDelete,
    handleConfirmDelete,
  } = useDeleteSessions({
    sessions,
    selectedIds,
    onDeleteSuccess: clearSelection,
  });

  const allIdsOnPage = sessions.map((s) => s.id);
  const areAllOnPageSelected = allIdsOnPage.length > 0 && allIdsOnPage.every((id) => selectedIds.includes(id));

  const handleToggleSelectAll = () => {
    if (areAllOnPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !sessions.some((s) => s.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...sessions.map((s) => s.id)])));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search + toolbar */}
      <div className="flex items-center justify-between">
        <SearchInput value={inputValue} onChange={handleInputChange} placeholder="Search by user name or email..." />
        {isSelectMode && (
          <div className="flex items-center gap-2 px-2">
            <Button variant="outline" size="sm" onClick={handleToggleSelectAll}>
              {areAllOnPageSelected ? "Deselect All" : "Select All"}
            </Button>

            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleMultiDelete}>
                Delete {selectedIds.length}
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={clearSelection}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Sessions grid */}
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isSelectMode={isSelectMode}
              isSelected={selectedIds.includes(session.id)}
              toggleSelection={toggleSelection}
              enterSelectMode={() => setIsSelectMode(true)}
              onDelete={() => handleSingleDelete(session)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/20 rounded-lg border py-12 text-center">
          <p className="text-muted-foreground">{query ? `No sessions match your search.` : "No sessions found."}</p>   
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onDelete={handleConfirmDelete}
          resourceName={deleteTarget.ids.length > 1 ? "sessions" : "session"}
          resourceDisplayName={deleteTarget.displayName}
          deleteLoading={isPending}
          requireTextConfirm={false}
        />
      )}
    </div>
  );
}
