"use client";

import Link from "next/link";
import { BarChart, Check, Copy, Edit, ExternalLink, Users } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { BASE_URL } from "@/shared/lib/constants";
import { formatTimestamp } from "@/shared/lib/utils";

import ChatbotStatusBadge from "@/features/admin/shared/components/ChatbotStatusBadge";
import { useCopyToClipboard } from "@/features/admin/shared/hooks/useCopyToClipboard";

import ChatbotCardMenu from "./ChatbotCardMenu";
import TooltipButton from "./TooltipButton";

import type { ChatbotSummary } from "@/types/client";

export default function ChatbotCard({ chatbot }: { chatbot: ChatbotSummary }) {
  const chatbotLink = `${BASE_URL}/chatbot/${chatbot.id}`;
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <Card className="overflow-hidden px-2 shadow-xl">
      <CardHeader className="flex flex-row items-start justify-between p-2">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full text-xl">
            {chatbot.icon}
          </div>
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold">{chatbot.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <ChatbotStatusBadge isActive={chatbot.isActive} />
              <Button
                variant="ghost"
                asChild
                className={`text-muted-foreground hover:text-foreground flex h-6 items-center px-2 text-xs`}
              >
                <Link href={`/view-chatbot-sessions/${chatbot.id}`}>
                  <Users className="mr-1 h-3 w-3" />
                  {chatbot.sessionCount}
                  {chatbot.sessionCount === 1 ? " session" : " sessions"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <ChatbotCardMenu chatbot={chatbot} />
      </CardHeader>

      <CardContent className="min-h-14 p-2">
        <p className="text-muted-foreground line-clamp-2 h-full text-sm">{chatbot.description}</p>
      </CardContent>

      <CardFooter className="text-muted-foreground flex items-center justify-between p-2 text-xs">
        <p>Updated {formatTimestamp(chatbot.updatedAt)}</p>
        <div className="flex gap-2">
          <TooltipButton tooltipContent="View chatbot sessions">
            <Link href={`/view-chatbot-sessions/${chatbot.id}`}>
              <BarChart className="h-4 w-4" />
            </Link>
          </TooltipButton>

          <TooltipButton tooltipContent="Copy chatbot link" onClick={() => copyToClipboard(chatbotLink)}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </TooltipButton>

          <TooltipButton tooltipContent="Open chatbot link">
            <Link href={chatbotLink} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </TooltipButton>

          <TooltipButton tooltipContent="Edit chatbot">
            <Link href={`/edit-chatbot/${chatbot.id}`}>
              <Edit className="mr-1 h-4 w-4" />
            </Link>
          </TooltipButton>
        </div>
      </CardFooter>
    </Card>
  );
}
