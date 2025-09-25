import { useState } from "react";

export function useMultiSelect() {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  return {
    isSelectMode,
    setIsSelectMode,
    selectedIds,
    setSelectedIds,
    toggleSelection,
    clearSelection,
  };
}
