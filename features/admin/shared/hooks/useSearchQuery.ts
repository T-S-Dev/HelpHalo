import { useState } from "react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export function useSearchQuery() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "", shallow: false });
  const [page, setPage] = useQueryState("page");
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

  return { query, inputValue, handleInputChange };
}
