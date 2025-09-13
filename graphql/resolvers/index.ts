import { GraphQLResolveInfo } from "graphql";

import { prisma } from "@/lib/prisma";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { ChatbotBasicInfo, ChatbotBasicInfoSchema } from "@/features/admin/chatbot-editor/lib/ChatbotBasicInfoSchema";

import { verifyChatbotOwnership, verifyCharacteristicOwnership } from "../lib/authService";
import { buildSelect } from "../lib/buildSelect";

import { Chatbot, ChatbotCharacteristic } from "@/types/client";
import { GraphQLContext } from "@/types/server";

export const resolvers = {
  Query: {
    chatbot: async (_: any, { id }: { id: string }, context: GraphQLContext, info: GraphQLResolveInfo) => {
      await verifyChatbotOwnership(context, id);

      const select = buildSelect(info);
      const chatbot = await prisma.chatbot.findUnique({
        where: { id },
        select,
      });

      if (!chatbot) throw new NotFoundError("Chatbot not found");

      return chatbot;
    },
  },

  Mutation: {
    createChatbot: async (_: any, args: ChatbotBasicInfo, context: GraphQLContext) => {
      if (!context.userId) throw new AuthorizationError("Unauthorized");

      const validatedData = ChatbotBasicInfoSchema.parse(args);

      return await prisma.chatbot.create({
        data: {
          clerkUserId: context.userId,
          ...validatedData,
        },
      });
    },

    updateChatbot: async (
      _: any,
      { id, ...data }: { id: Chatbot["id"] } & Partial<ChatbotBasicInfo>,
      context: GraphQLContext,
    ) => {
      await verifyChatbotOwnership(context, id);

      const validatedData = ChatbotBasicInfoSchema.partial().parse(data);

      return await prisma.chatbot.update({
        where: { id },
        data: validatedData,
      });
    },

    deleteChatbot: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      await verifyChatbotOwnership(context, id);
      return await prisma.chatbot.delete({ where: { id } });
    },

    createChatbotCharacteristic: async (
      _: any,
      { content, chatbotId }: { content: string; chatbotId: Chatbot["id"] },
      context: GraphQLContext,
    ) => {
      await verifyChatbotOwnership(context, chatbotId);

      const [newCharacteristic] = await prisma.$transaction([
        prisma.chatbotCharacteristic.create({
          data: { content, chatbotId },
        }),
        prisma.chatbot.update({
          where: { id: chatbotId },
          data: { updatedAt: new Date() },
        }),
      ]);

      return newCharacteristic;
    },

    deleteChatbotCharacteristic: async (
      _: any,
      { id }: { id: ChatbotCharacteristic["id"] },
      context: GraphQLContext,
    ) => {
      await verifyCharacteristicOwnership(context, id);

      const characteristic = await prisma.chatbotCharacteristic.findUnique({
        where: { id },
        select: { chatbotId: true },
      });

      if (!characteristic) {
        throw new NotFoundError("Characteristic not found.");
      }

      const [deletedCharacteristic] = await prisma.$transaction([
        prisma.chatbotCharacteristic.delete({ where: { id } }),
        prisma.chatbot.update({
          where: { id: characteristic.chatbotId },
          data: { updatedAt: new Date() },
        }),
      ]);

      return deletedCharacteristic;
    },
  },
};
