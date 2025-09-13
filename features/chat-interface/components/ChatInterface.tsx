"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCcw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChatMessage from "@/components/ChatMessage";
import { Input } from "@/components/ui/input";

import sendMessageAction from "../actions/send-message.action";

import type { Message } from "@/types/client";
import type { ChatbotPublic } from "@/types/shared";

type Props = {
  chatbot: ChatbotPublic;
  chatSessionId: string;
  messages: Message[];
  onNewChat: () => void;
  onAppendMessage: (msg: Message) => void;
};

export default function ChatInterface({ chatbot, chatSessionId, messages, onNewChat, onAppendMessage }: Props) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      chatSessionId: chatSessionId,
      content: input,
      sender: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAppendMessage(userMsg);
    setInput("");
    setIsTyping(true);

    try {
      const result = await sendMessageAction(chatSessionId, chatbot.id, input);
      if (result.success) {
        onAppendMessage(result.data.message);
      } else {
        console.error("Failed to send message:", result.error);
        setInput(input);
      }
    } catch (error) {
      console.error(error);
      setInput(input);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full max-w-4xl">
          <Card className="flex h-full flex-col overflow-hidden border-0 p-0 shadow-none">
            <CardContent className="flex-1 overflow-y-auto px-0 py-2">
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && (
                  <ChatMessage
                    message={{
                      id: "typing",
                      chatSessionId: chatSessionId,
                      content: "Typing...",
                      sender: "BOT",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                  />
                )}
                <div ref={bottomRef} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex h-12 gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-full flex-1"
            />
            <Button disabled={!input.trim() || isTyping} onClick={handleSendMessage} className="h-full w-12">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
