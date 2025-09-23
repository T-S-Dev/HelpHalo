"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

import SearchInput from "@/features/admin/shared/components/SearchInput";

import ChatbotCard from "./ChatbotCard";
import StatusFilter from "./StatusFilter";

import type { ChatbotSummary } from "@/types/client";

const validStatuses = ["all", "active", "inactive"] as const;
type Status = (typeof validStatuses)[number];

const ChatbotGrid = ({ chatbots }: { chatbots: ChatbotSummary[] }) => {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });

  const [status, setStatus] = useQueryState<Status>("status", {
    defaultValue: "all",
    shallow: false,
    parse: (value) => (validStatuses.includes(value as Status) ? (value as Status) : "all"),
  });

  const [page, setPage] = useQueryState("page", { shallow: false });

  const [inputValue, setInputValue] = useState(query);

  const debouncedUpdateUrl = useDebouncedCallback((newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(null);
    }
  }, 500);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedUpdateUrl(value.trim());
  };

  const hasActiveFilters = query || status !== "all";

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
          <p className="text-muted-foreground">
            {hasActiveFilters ? "No chatbots match your filters." : "You don't have any chatbots yet."}{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatbotGrid;
