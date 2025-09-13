import { Badge } from "@/shared/components/ui/badge";

export default function ChatbotStatusBadge({ isActive }: { isActive: boolean }) {
  const statusStyle = isActive ? "text-green-500 bg-green-500/20" : "text-red-500 bg-red-500/20";

  return (
    <Badge
      variant="outline"
      className={`mt-1 capitalize ${statusStyle}`}
      aria-label={isActive ? "Active chatbot" : "Inactive chatbot"}
    >
      {isActive ? "active" : "inactive"}
    </Badge>
  );
}
