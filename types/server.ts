import { NextRequest } from "next/server";

export type GraphQLContext = {
  req: NextRequest;
  userId: string | null;
};

export type ChatbotSummary = {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  updatedAt: Date;
  sessionCount: number;
};

export type ChatbotSessionSummary = {
  id: string;
  chatbotId: string;
  guest: { name: string; email: string | null };
  messageCount: number;
  lastMessage: string;
  lastAt: Date;
  duration: number;
};
