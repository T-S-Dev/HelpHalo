import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/tryCatch";

import ErrorAlert from "@/features/admin/shared/components/ErrorAlert";
import PaginationControls from "@/features/admin/shared/components/PaginationControls";
import ChatbotGrid from "@/features/admin/chatbot-management/components/ChatbotGrid";
import getChatbotsForOwner from "@/features/admin/chatbot-management/services/get-chatbots-for-owner.service";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import type { ChatbotSummary } from "@/types/client";

type Props = {
  searchParams: Promise<{ page: string; q: string; status: "all" | "active" | "inactive" }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const [resolvedSearchParams, { userId }] = await Promise.all([searchParams, getCurrentUser()]);
  if (!userId) redirect("/sign-in");

  const query = resolvedSearchParams.q || "";
  const currentStatus = resolvedSearchParams.status || "all";
  const currentPage = Math.max(Number(resolvedSearchParams.page) || 1, 1);

  const [chatbotData, error] = await tryCatch(getChatbotsForOwner(userId, query, currentStatus, currentPage));

  if (error) {
    console.error(error);
    return <ErrorAlert message="Failed to load your chatbots. Please try again." />;
  }

  const chatbots: ChatbotSummary[] = chatbotData.chatbots.map((bot) => ({
    ...bot,
    updatedAt: bot.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbots</h1>
          <p className="text-muted-foreground mt-1">Manage your custom AI chatbots</p>
        </div>
        <Link href="/create-chatbot">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Create Chatbot
          </Button>
        </Link>
      </div>

      <ChatbotGrid chatbots={chatbots} />

      <PaginationControls currentPage={currentPage} totalPages={chatbotData.totalPages} />
    </div>
  );
}
