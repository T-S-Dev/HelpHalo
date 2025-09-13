import { gql } from "@apollo/client";

export const typeDefs = gql`
  scalar DateTime

  enum Sender {
    USER
    BOT
  }

  type Chatbot {
    id: String!
    clerkUserId: String!
    icon: String!
    name: String!
    description: String!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    chatSessions: [ChatSession]
    characteristics: [ChatbotCharacteristic]
  }

  type ChatbotCharacteristic {
    id: String!
    chatbotId: String
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    chatbot: Chatbot
  }

  type Guest {
    id: String!
    createdAt: DateTime!
    email: String
    name: String
    chatSessions: [ChatSession]
  }

  type ChatSession {
    id: String!
    chatbotId: String
    createdAt: DateTime!
    updatedAt: DateTime!
    guestId: String
    chatbot: Chatbot
    guest: Guest
    messages: [Message]
  }

  type Message {
    id: String!
    chatSessionId: String
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    sender: Sender!
    chatSession: ChatSession
  }

  # Queries
  type Query {
    chatbot(id: String!): Chatbot
    chatSession(id: String!): ChatSession
  }

  # Mutations
  type Mutation {
    createChatbot(icon: String!, name: String!, description: String!, isActive: Boolean!, clerkUserId: String): Chatbot

    updateChatbot(id: String!, icon: String, name: String, description: String, isActive: Boolean): Chatbot

    deleteChatbot(id: String!): Chatbot

    createChatbotCharacteristic(content: String!, chatbotId: String!): ChatbotCharacteristic

    deleteChatbotCharacteristic(id: String!): ChatbotCharacteristic
  }
`;
