import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Edit, ExternalLink } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import ChatMessage from "@/shared/components/ChatMessage";
import { NotFoundError } from "@/shared/lib/errors";
import { formatDuration, formatTimestamp } from "@/shared/lib/utils";
import { tryCatch } from "@/shared/lib/tryCatch";

import ErrorAlert from "@/features/admin/shared/components/ErrorAlert";
import getChatSession from "@/features/admin/session-viewer/services/get-chat-session.service";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

import type { Message } from "@/types/client";

type Props = {
  chatbotId: string;
  sessionId: string;
};

export default async function ChatbotConversation({ params }: { params: Promise<Props> }) {
  const [{ chatbotId, sessionId }, { userId }] = await Promise.all([params, getCurrentUser()]);
  if (!userId) redirect("/sign-in");

  const [sessionData, error] = await tryCatch(getChatSession(sessionId, userId));

  if (error instanceof NotFoundError) {
    console.error(error);
    notFound();
  }

  if (error) {
    console.error(error);
    return <ErrorAlert message="Failed to load conversation. Please try again." />;
  }

  const messages: Message[] = sessionData.messages.map((message) => ({
    ...message,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto flex h-[92vh] max-h-[92vh] max-w-4xl flex-col gap-4 px-4 py-8">
      {/* Header */}
      <div>
        {/* Navigation Bar */}
        <div className="mb-4 flex flex-row justify-between">
          <Button asChild variant="ghost" className="!pl-0">
            <Link href={`/view-chatbot-sessions/${chatbotId}`} className="flex items-center">
              <ChevronLeft className="h-4 w-4" />
              Back to Sessions
            </Link>
          </Button>
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

        {/* Session Info */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Conversation with {sessionData.guest.name} - {sessionData.guest.email}
        </h1>
        <p className="text-muted-foreground mt-1">
          {formatTimestamp(sessionData.updatedAt)} •{" "}
          {formatDuration(sessionData.createdAt, sessionData.messages[sessionData.messages.length - 1].createdAt)}
        </p>
      </div>

      {/* Chat Messages */}
      <Card className="min-h-0 flex-1">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <Badge className="bg-primary/20 text-primary">{sessionData.messages.length} messages</Badge>
          <Badge className="bg-primary/20 text-primary">{sessionData.chatbot.name}</Badge>
        </CardHeader>
        <CardContent className="overflow-y-auto p-0">
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message: Message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
