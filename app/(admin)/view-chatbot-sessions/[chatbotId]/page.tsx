import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Edit, ExternalLink } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { NotFoundError } from "@/shared/lib/errors";
import { tryCatch } from "@/shared/lib/tryCatch";

import BackToDashboardButton from "@/features/admin/shared/components/BackToDashboardButton";
import ErrorAlert from "@/features/admin/shared/components/ErrorAlert";
import PaginationControls from "@/features/admin/shared/components/PaginationControls";
import ChatbotSessionsGrid from "@/features/admin/session-viewer/components/ChatbotSessionsGrid";
import getChatSessionPreviews from "@/features/admin/session-viewer/services/get-chat-session-previews.service";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

type Props = {
  params: Promise<{ chatbotId: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function ViewChatbotSessionsPage({ params, searchParams }: Props) {
  const [{ chatbotId }, resolvedSearchParams, { userId }] = await Promise.all([params, searchParams, getCurrentUser()]);
  if (!userId) redirect("/login");

  const query = resolvedSearchParams.q || "";
  const currentPage = Math.max(Number(resolvedSearchParams.page) || 1, 1);

  const [chatSessionsData, error] = await tryCatch(getChatSessionPreviews(chatbotId, userId, query, currentPage));

  if (error instanceof NotFoundError) {
    console.error(error);
    notFound();
  }

  if (error) {
    console.error(error);
    return <ErrorAlert message="Failed to load chatbot sessions. Please try again." />;
  }

  const { chatbotName, totalPages } = chatSessionsData;

  const sessions = chatSessionsData.sessions.map((session) => ({
    ...session,
    lastAt: session.lastAt.toISOString(),
  }));

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <NavigationBar chatbotId={chatbotId} />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">{chatbotName} Sessions</h1>
          <p className="text-muted-foreground mt-1">View and analyze individual user conversations</p>
        </div>
      </div>

      <ChatbotSessionsGrid sessions={sessions} />

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

const NavigationBar = ({ chatbotId }: { chatbotId: string }) => {
  return (
    <div className="flex flex-row justify-between">
      <BackToDashboardButton />
      <div className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href={`/edit-chatbot/${chatbotId}`} className="flex items-center">
            <Edit className="h-4 w-4" />
            <span>Edit Chatbot</span>
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/chatbot/${chatbotId}`} className="flex items-center">
            <ExternalLink className="h-4 w-4" />
            <span>View Chatbot</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
