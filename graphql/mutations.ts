import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot($icon: String!, $name: String!, $description: String!, $isActive: Boolean!) {
    createChatbot(icon: $icon, name: $name, description: $description, isActive: $isActive) {
      id
      icon
      name
      description
      isActive
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: String!, $icon: String, $name: String, $description: String, $isActive: Boolean) {
    updateChatbot(id: $id, icon: $icon, name: $name, description: $description, isActive: $isActive) {
      id
      icon
      name
      description
      isActive
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbot($id: String!) {
    deleteChatbot(id: $id) {
      id
    }
  }
`;

export const CREATE_CHATBOT_CHARACTERISTIC = gql`
  mutation CreateChatbotCharacteristic($content: String!, $chatbotId: String!) {
    createChatbotCharacteristic(content: $content, chatbotId: $chatbotId) {
      id
      chatbotId
      content
    }
  }
`;

export const DELETE_CHATBOT_CHARACTERISTIC = gql`
  mutation DeleteChatbotCharacteristic($id: String!) {
    deleteChatbotCharacteristic(id: $id) {
      id
    }
  }
`;
