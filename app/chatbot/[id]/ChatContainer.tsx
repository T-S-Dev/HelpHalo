"use client";

import { useState } from "react";

import ChatInterface from "@/features/chat-interface/components/ChatInterface";
import UserInfoDialog from "@/features/chat-interface/components/UserInfoDialog";
import clearChatSessionAction from "@/features/chat-interface/actions/clear-chat-session.action";

import type { StartNewChatResult } from "@/features/chat-interface/actions/start-new-chat.action";
import type { Message } from "@/types/client";
import type { ChatbotPublic } from "@/types/shared";

type Props = {
  chatbot: ChatbotPublic;
  initialChatSessionId: string | null;
  initialMessages: Message[];
};

export default function ChatContainer({ chatbot, initialChatSessionId, initialMessages }: Props) {
  const [chatSessionId, setChatSessionId] = useState<string | null>(initialChatSessionId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSessionStart = (result: StartNewChatResult) => {
    setChatSessionId(result.chatSessionId);
    setMessages([result.initialBotMessage]);
  };

  const handleNewChat = async () => {
    await clearChatSessionAction(chatbot.id);
    setChatSessionId(null);
    setMessages([]);
  };

  const handleAppendMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
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
        />
      )}
    </>
  );
}
