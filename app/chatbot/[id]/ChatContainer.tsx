"use client";

import { useState, useTransition } from "react";

import ChatInterface from "@/features/chat-interface/components/ChatInterface";
import UserInfoDialog from "@/features/chat-interface/components/UserInfoDialog";
import clearChatSessionAction from "@/features/chat-interface/actions/clear-chat-session.action";

import type { StartNewChatResult } from "@/features/chat-interface/actions/start-new-chat.action";
import type { Message } from "@/types/client";
import type { ChatbotPublic } from "@/types/shared";
import fetchMoreMessagesAction from "@/features/chat-interface/actions/fetch-more-messages.action";
import { toast } from "sonner";

type Props = {
  chatbot: ChatbotPublic;
  initialChatSessionId: string | null;
  initialMessages: Message[];
  initialNextCursor: string | null;
};

export default function ChatContainer({ chatbot, initialChatSessionId, initialMessages, initialNextCursor }: Props) {
  const [chatSessionId, setChatSessionId] = useState<string | null>(initialChatSessionId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isHistoryLoading, startHistoryTransition] = useTransition();

  const handleSessionStart = (result: StartNewChatResult) => {
    setChatSessionId(result.chatSessionId);
    setMessages([result.initialBotMessage]);
    setNextCursor(null);
  };

  const handleNewChat = async () => {
    await clearChatSessionAction(chatbot.id);
    setChatSessionId(null);
    setMessages([]);
    setNextCursor(null);
  };

  const handleAppendMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleLoadMore = async () => {
    if (!nextCursor || isHistoryLoading || !chatSessionId) return;

    startHistoryTransition(async () => {
      const result = await fetchMoreMessagesAction(chatSessionId, nextCursor);

      if (result.success) {
        const { messages: olderMessages, nextCursor: newNextCursor } = result.data;
        // Prepend the older messages to the start of the list
        setMessages((prev) => [...olderMessages, ...prev]);
        setNextCursor(newNextCursor);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <UserInfoDialog chatbot={chatbot} onSessionStart={handleSessionStart} isOpen={!chatSessionId} />
      {chatSessionId && (
        <ChatInterface
          chatbot={chatbot}
          chatSessionId={chatSessionId}
          messages={messages}
          onNewChat={handleNewChat}
          onAppendMessage={handleAppendMessage}
          onLoadMore={handleLoadMore}
          isHistoryLoading={isHistoryLoading}
        />
      )}
    </>
  );
}
