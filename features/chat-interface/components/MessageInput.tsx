"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Send } from "lucide-react";
import type { Message } from "@/types/client";
import sendMessageAction from "../actions/send-message.action";

type Props = {
  chatSessionId: string;
  chatbotId: string;
  onAppendMessage: (msg: Message) => void;
  isTyping: boolean;
  setIsTyping: (value: boolean) => void;
};

export default function MessageInput({ chatSessionId, chatbotId, onAppendMessage, isTyping, setIsTyping }: Props) {
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      chatSessionId,
      content: input,
      sender: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAppendMessage(userMsg);
    setInput("");
    setIsTyping(true);

    try {
      const result = await sendMessageAction(chatSessionId, chatbotId, input);
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
  );
}
