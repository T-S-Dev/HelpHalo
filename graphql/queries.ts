import { gql } from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: String!) {
    chatbot(id: $id) {
      id
      clerkUserId
      icon
      name
      description
      isActive
      createdAt
      updatedAt
      characteristics {
        id
        chatbotId
        content
      }
    }
  }
`;
