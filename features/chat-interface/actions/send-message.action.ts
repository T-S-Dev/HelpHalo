"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";

import { AppError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

import getChatbotCharacteristics from "../services/chatbot/get-chatbot-characteristics.service";
import getSessionHistoryForAI from "../services/chat/get-session-history-for-ai.service";
import insertMessage from "../services/chat/insert-message.service";

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { Action } from "@/types/actions";
import type { Message } from "@/types/client";

const openaiClient = new OpenAI();

export default async function sendMessageAction(
  chatSessionId: string,
  chatbotId: string,
  content: string,
): Action<{ message: Message }> {
  if (!chatSessionId || !chatbotId || !content) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // 1. Fetch Chatbot Characteristics
    const characteristics = await getChatbotCharacteristics(chatbotId);
    if (!characteristics) return { success: false, error: "Chatbot not found" };
    const knowledgeBase = characteristics.map((c) => c.content).join(",");

    // 2. Fetch previous chat session messages
    const messages = await getSessionHistoryForAI(chatSessionId);
    if (messages === null) return { success: false, error: "Chat session not found" };

    // 3. Generate AI response using OpenAI API
    const systemMsg: ChatCompletionMessageParam = {
      role: "system",
      content: `You are a helpful customer support assistant.

      **Your Knowledge Base:**
      You must base all factual answers exclusively on the information provided below. Do not use any outside knowledge.
      ---
      ${knowledgeBase}
      ---

      **Your Core Tasks:**
      1.  Answer user questions accurately using ONLY the provided Knowledge Base.
      2.  If you cannot answer a question from the Knowledge Base, politely state that you don't have information on that topic. Do not make up answers.
      3.  You MAY and SHOULD use your general abilities to format your answers in helpful ways. If a user asks for information in a table, list, or other format, create it for them using the information from the Knowledge Base.
      `,
    };
    const history: ChatCompletionMessageParam[] = messages.map((m) => ({
      role: m.sender === "USER" ? "user" : "assistant",
      content: m.content,
    }));
    const userMsg: ChatCompletionMessageParam = { role: "user", content };

    const payload: ChatCompletionMessageParam[] = [systemMsg, ...history, userMsg];

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: payload,
    });

    const aiMessage = completion.choices?.[0]?.message?.content;
    if (!aiMessage) throw new ValidationError("No AI response generated");

    // 4. Persist user question + AI reply
    const savedAi = await prisma.$transaction(async (tx) => {
      await insertMessage({ chatSessionId, content, sender: "USER" }, tx);
      const savedAiMessage = await insertMessage({ chatSessionId, content: aiMessage, sender: "BOT" }, tx);
      return savedAiMessage;
    });

    const serializedMessage = {
      ...savedAi,
      createdAt: savedAi.createdAt.toISOString(),
      updatedAt: savedAi.updatedAt.toISOString(),
    };

    revalidatePath(`/chatbot/${chatbotId}`);

    return { success: true, data: { message: serializedMessage } };
  } catch (error) {
    console.error("Error processing message:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
