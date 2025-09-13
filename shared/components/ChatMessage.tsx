"use client";

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { formatMessageTime } from "@/shared/lib/utils";

import { Message } from "@/types/client";

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === "USER";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[80%] gap-3">
        <div className={`flex-shrink-0 ${isUser ? "order-2" : "order-1"}`}>
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            {isUser ? <User className="text-primary h-4 w-4" /> : <Bot className="text-primary h-4 w-4" />}
          </div>
        </div>

        <div className={`flex flex-col ${isUser ? "order-1" : "order-2"}`}>
          <div className={`rounded-lg px-3 py-2 ${isUser ? "bg-primary text-primary-foreground" : "bg-primary/20"}`}>
            {isUser ? (
              <p className="text-sm break-words">{message.content}</p>
            ) : (
              <div className="prose prose-sm text-primary break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
          <div className={`text-muted-foreground mt-1 text-xs ${isUser && "text-end"}`}>
            {formatMessageTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
