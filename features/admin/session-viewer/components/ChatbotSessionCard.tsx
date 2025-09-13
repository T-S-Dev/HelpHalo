import Link from "next/link";
import { Clock, MessageSquare, User } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { formatDurationFromMs, formatTimestamp } from "@/shared/lib/utils";

import type { ChatbotSessionSummary } from "@/types/client";

type Props = {
  session: ChatbotSessionSummary;
};

const ChatbotSessionCard = ({ session }: Props) => {
  if (!session) {
    return null;
  }

  return (
    <Link href={`/view-chatbot-sessions/${session.chatbotId}/conversation/${session.id}`}>
      <Card className="overflow-hidden px-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <User className="text-primary h-4 w-4" />
            </div>
            <div>
              <h3 className="truncate text-sm font-medium">{session.guest?.name}</h3>
              <h3 className="truncate text-sm font-medium">{session.guest?.email}</h3>
              <p className="text-muted-foreground text-xs">{formatTimestamp(session.lastAt)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-14 p-2">
          <p className="text-muted-foreground line-clamp-2 h-full text-sm">{session.lastMessage}</p>
        </CardContent>

        <CardFooter className="text-muted-foreground flex items-center justify-between p-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDurationFromMs(session.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{session.messageCount} messages</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ChatbotSessionCard;
