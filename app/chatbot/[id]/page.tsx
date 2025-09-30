import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { ValidationError } from "@/lib/errors";
import { tryCatch } from "@/lib/tryCatch";

import SessionError from "@/features/chat-interface/components/SessionError";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";
import getChatbotPublic from "@/features/chat-interface/services/chatbot/get-chatbot-public.service";
import getSessionMessages from "@/features/chat-interface/services/chat/get-session-messages.service";

import ChatContainer from "./ChatContainer";

export default async function ChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ userId }, cookieStore, { id }] = await Promise.all([getCurrentUser(), cookies(), params]);

  const sessionId = cookieStore.get(`chatSessionId-${id}`)?.value ?? null;

  const [chatbot, chatbotError] = await tryCatch(getChatbotPublic(id, userId ?? undefined));

  if (chatbotError instanceof ValidationError) {
    console.error("Chatbot access error:", chatbotError.message);
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Chatbot Unavailable</h1>
        <p className="text-muted-foreground">{chatbotError.message}</p>
      </div>
    );
  }

  if (chatbotError) {
    console.error("Error fetching chatbot:", chatbotError);
    notFound();
  }

  const [messagesResult, messagesError] = await tryCatch(
    sessionId ? getSessionMessages(sessionId) : Promise.resolve({ messages: [], nextCursor: null }),
  );

  if (sessionId && messagesError) {
    console.error("Error fetching session messages:", messagesError);
    return <SessionError chatbotId={chatbot.id} />;
  }

  const initialMessages = messagesResult
    ? messagesResult.messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      }))
    : [];

  return (
    <ChatContainer
      chatbot={chatbot}
      initialChatSessionId={sessionId}
      initialMessages={initialMessages}
      initialNextCursor={messagesResult?.nextCursor ?? null}
    />
  );
}
