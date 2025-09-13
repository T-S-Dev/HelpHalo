export type Chatbot = {
  id: string;
  clerkUserId: string;
  icon: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  characteristics?: ChatbotCharacteristic[];
  chatSessions?: ChatbotSession[];
};

export type ChatbotSummary = {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
  sessionCount: number;
};

export type ChatbotSessionSummary = {
  id: string;
  chatbotId: string;
  guest: { name: string; email: string | null };
  messageCount: number;
  lastMessage: string;
  lastAt: string;
  duration: number;
};

export type ChatbotCharacteristic = {
  id: string;
  chatbotId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type Guest = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatbotSession = {
  id: string;
  chatbotId: string;
  guestId: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  chatbot: Chatbot;
  guest: Guest;
};

export type Message = {
  id: string;
  chatSessionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: "USER" | "BOT";
};