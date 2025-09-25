"use client";

import Link from "next/link";
import { Clock, MessageSquare, User, MoreVertical, Trash2, CheckSquare } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDurationFromMs, formatTimestamp } from "@/lib/utils";

import type { ChatbotSessionSummary } from "@/types/client";

type Props = {
  session: ChatbotSessionSummary;
  isSelectMode: boolean;
  isSelected: boolean;
  toggleSelection: (id: string) => void;
  enterSelectMode: () => void;
  onDelete: () => void;
};

const ChatbotSessionCard = ({
  session,
  isSelectMode,
  isSelected,
  toggleSelection,
  enterSelectMode,
  onDelete,
}: Props) => {
  if (!session) return null;

  const handleInteractiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Link
      href={`/view-chatbot-sessions/${session.chatbotId}/conversation/${session.id}`}
      onClick={(e) => {
        if (isSelectMode) {
          e.preventDefault();
          toggleSelection(session.id);
        }
      }}
    >
      <Card className={`overflow-hidden px-2 shadow-xl ${isSelectMode ? "" : "hover:shadow-2xl"}`}>
        <CardHeader className="flex justify-between p-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
              <User className="text-primary h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium">{session.guest?.name}</h3>
              <h3 className="truncate text-sm font-medium">{session.guest?.email}</h3>
              <p className="text-muted-foreground text-xs">{formatTimestamp(session.lastAt)}</p>
            </div>
          </div>

          {!isSelectMode ? (
            <div onClick={handleInteractiveClick}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive focus:bg-destructive/20"
                  >
                    <Trash2 className="text-destructive mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      enterSelectMode();
                      toggleSelection(session.id);
                    }}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Select
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div onClick={handleInteractiveClick}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleSelection(session.id)}
                className="z-10 size-5"
              />
            </div>
          )}
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
