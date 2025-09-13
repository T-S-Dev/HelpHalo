import { Filter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

type StatusFilterProps = {
  value: "all" | "active" | "inactive";
  onChange: (value: "all" | "active" | "inactive") => void;
};

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={(value) => onChange(value as "all" | "active" | "inactive")}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" aria-hidden="true" />
          <SelectValue placeholder="Filter by status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectSeparator />
        <SelectItem value="active">Active</SelectItem>
        <SelectSeparator />
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
}
