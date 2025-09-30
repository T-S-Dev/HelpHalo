"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Message } from "@/types/client";
import type { ChatbotPublic } from "@/types/shared";

type Props = {
  chatbot: ChatbotPublic;
  chatSessionId: string;
  messages: Message[];
  onNewChat: () => void;
  onAppendMessage: (msg: Message) => void;
  onLoadMore: () => void;
  isHistoryLoading: boolean;
};

export default function ChatInterface({
  chatbot,
  chatSessionId,
  messages,
  onNewChat,
  onAppendMessage,
  onLoadMore,
  isHistoryLoading,
}: Props) {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="bg-background flex h-screen flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full text-xl">
              {chatbot.icon}
            </div>
            <h1 className="text-xl font-bold">{chatbot.name}</h1>
            <Button variant="outline" size="sm" onClick={onNewChat} className="ml-auto gap-1">
              <RefreshCcw className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 overflow-hidden">
        <MessageList
          messages={messages}
          chatSessionId={chatSessionId}
          isHistoryLoading={isHistoryLoading}
          isTyping={isTyping}
          onLoadMore={onLoadMore}
        />
      </main>

      <footer className="border-t p-4">
        <div className="container mx-auto max-w-4xl">
          <MessageInput
            chatSessionId={chatSessionId}
            chatbotId={chatbot.id}
            onAppendMessage={onAppendMessage}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
          />
        </div>
      </footer>
    </div>
  );
}
