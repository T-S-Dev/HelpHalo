"use client";

import { useQueryState } from "nuqs";

import SearchInput from "@/features/admin/shared/components/SearchInput";

import ChatbotCard from "./ChatbotCard";
import StatusFilter from "./StatusFilter";
import { useSearchQuery } from "../../shared/hooks/useSearchQuery";

import type { ChatbotSummary } from "@/types/client";

const validStatuses = ["all", "active", "inactive"] as const;
type Status = (typeof validStatuses)[number];

const ChatbotGrid = ({ chatbots }: { chatbots: ChatbotSummary[] }) => {
  const { inputValue, handleInputChange } = useSearchQuery();

  const [status, setStatus] = useQueryState<Status>("status", {
    defaultValue: "all",
    shallow: false,
    parse: (value) => (validStatuses.includes(value as Status) ? (value as Status) : "all"),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchInput value={inputValue} onChange={handleInputChange} placeholder="Search chatbots by name..." />
        <div className="flex gap-2">
          <StatusFilter value={status} onChange={setStatus} />
        </div>
      </div>

      {chatbots.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((chatbot) => (
            <ChatbotCard key={chatbot.id} chatbot={chatbot} />
          ))}
        </div>
      ) : (
        <div className="bg-muted/20 rounded-lg border py-12 text-center">
          <p className="text-muted-foreground">No chatbots found</p>
        </div>
      )}
    </div>
  );
};

export default ChatbotGrid;
