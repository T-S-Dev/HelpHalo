"use client";

import SearchInput from "@/features/admin/shared/components/SearchInput";

import SessionCard from "./ChatbotSessionCard";
import { useSearchQuery } from "../../shared/hooks/useSearchQuery";

import type { ChatbotSessionSummary } from "@/types/client";

export default function ChatbotSessionsGrid({ sessions }: { sessions: ChatbotSessionSummary[] }) {
  const { inputValue, handleInputChange } = useSearchQuery();

  return (
    <div className="flex flex-col gap-4">
      <SearchInput value={inputValue} onChange={handleInputChange} placeholder="Search by user name or email..." />

      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="bg-muted/20 rounded-lg border py-12 text-center">
          <p className="text-muted-foreground">No session found</p>
        </div>
      )}
    </div>
  );
}
