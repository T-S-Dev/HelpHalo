import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input placeholder={placeholder} className="pl-10" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
