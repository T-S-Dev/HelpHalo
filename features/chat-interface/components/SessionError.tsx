"use client";

import { useState, useTransition } from "react";
import { ServerCrash, RefreshCcw, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import clearChatSessionAction from "../actions/clear-chat-session.action";

type Props = {
  chatbotId: string;
};

export default function SessionError({ chatbotId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNewSession = () => {
    startTransition(async () => {
      await clearChatSessionAction(chatbotId);
      window.location.reload();
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 px-4 text-center">
      <ServerCrash className="h-16 w-16 text-red-500" />
      <h1 className="text-2xl font-bold">Error Loading Session</h1>
      <p className="text-muted-foreground">Your previous conversation could not be retrieved.</p>
      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={handleRefresh} disabled={isPending || isRefreshing}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          {isRefreshing ? "Reloading..." : "Try Again"}
        </Button>
        <Button onClick={handleNewSession} disabled={isPending || isRefreshing}>
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          {isPending ? "Starting..." : "New Chat"}
        </Button>
      </div>
    </div>
  );
}
