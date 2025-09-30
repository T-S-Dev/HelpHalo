"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import Loader from "@/components/Loader";
import type { Message } from "@/types/client";

type Props = {
  messages: Message[];
  chatSessionId: string;
  isHistoryLoading: boolean;
  isTyping: boolean;
  onLoadMore: () => void;
};

export default function MessageList({ messages, chatSessionId, isHistoryLoading, isTyping, onLoadMore }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const anchorMessageIdRef = useRef<string | null>(null);

  // Infinite scroll for loading more messages
  useEffect(() => {
    if (!topRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isHistoryLoading) {
          handleLoadMore();
        }
      },
      { root: containerRef.current, threshold: 1 },
    );

    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [isHistoryLoading]);

  const handleLoadMore = () => {
    if (!containerRef.current || messages.length === 0) return;

    const previousHeight = containerRef.current.scrollHeight;
    anchorMessageIdRef.current = messages[0].id;

    onLoadMore();

    containerRef.current.scrollTop = containerRef.current.scrollHeight - previousHeight;
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll to anchor message after load more
  useEffect(() => {
    if (anchorMessageIdRef.current) {
      const anchorElement = document.querySelector(`[data-message-id="${anchorMessageIdRef.current}"]`);
      if (anchorElement) anchorElement.scrollIntoView();
      anchorMessageIdRef.current = null;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <div ref={topRef}>
        {isHistoryLoading && (
          <div className="flex w-full justify-center">
            <Loader />
          </div>
        )}
      </div>

      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isTyping && (
        <ChatMessage
          message={{
            id: "typing",
            chatSessionId,
            content: "Typing...",
            sender: "BOT",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
