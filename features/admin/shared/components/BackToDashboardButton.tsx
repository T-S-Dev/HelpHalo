import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BackToDashboardButton() {
  return (
    <Button asChild variant="ghost" className="!pl-0">
      <Link href="/dashboard" className="flex items-center">
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
    </Button>
  );
}
