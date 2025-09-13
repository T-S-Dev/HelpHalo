"use client";

import ChatbotFormBasicInfo from "./ChatbotFormBasicInfo";
import ChatbotFormCharacteristics from "./ChatbotFormCharacteristics";

import type { Chatbot } from "@/types/client";

type Props = {
  isEditing?: boolean;
  initialData?: Chatbot;
};

const ChatbotForm = ({ isEditing = false, initialData }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <ChatbotFormBasicInfo isEditing={isEditing} initialData={initialData} />

      {isEditing && (
        <ChatbotFormCharacteristics chatbotId={initialData?.id} characteristics={initialData?.characteristics} />
      )}
    </div>
  );
};

export default ChatbotForm;
