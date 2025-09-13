"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { CREATE_CHATBOT_CHARACTERISTIC } from "@/graphql/mutations";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries";
import { tryCatch } from "@/shared/lib/tryCatch";

import Characteristic from "./Characteristic";

import type { ChatbotCharacteristic } from "@/types/client";

type Props = {
  chatbotId?: string;
  characteristics?: ChatbotCharacteristic[];
};

export default function ChatbotFormCharacteristics({ chatbotId, characteristics }: Props) {
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const [addCharacteristic] = useMutation(CREATE_CHATBOT_CHARACTERISTIC, {
    update: (cache, { data: { createChatbotCharacteristic } }) => {
      const existingData: any = cache.readQuery({
        query: GET_CHATBOT_BY_ID,
        variables: { id: chatbotId },
      });

      if (existingData && existingData.chatbot) {
        cache.writeQuery({
          query: GET_CHATBOT_BY_ID,
          variables: { id: chatbotId },
          data: {
            chatbot: {
              ...existingData.chatbot,
              characteristics: [...existingData.chatbot.characteristics, createChatbotCharacteristic],
            },
          },
        });
      }
    },
    optimisticResponse: {
      createChatbotCharacteristic: {
        __typename: "ChatbotCharacteristic",
        id: "temp-id-" + Math.random().toString(36),
        chatbotId: chatbotId,
        content: newCharacteristic,
      },
    },
  });

  const handleAddCharacteristic = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCharacteristic || !chatbotId) return;
    setNewCharacteristic("");

    const [, error] = await tryCatch(
      addCharacteristic({
        variables: {
          chatbotId,
          content: newCharacteristic,
        },
      }),
    );

    if (error) toast.error("Failed to add characteristic");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl leading-none font-semibold tracking-tight">
          Here&apos;s what your chatbot knows
        </CardTitle>
        <CardDescription>
          Your chatbot is equipped with the following information to assist your customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="flex gap-2" onSubmit={handleAddCharacteristic}>
          <Input
            id="newCharacteristic"
            placeholder="Example: If user asks for a refund, provide a link to the refund policy at www.example.com/refund"
            value={newCharacteristic}
            onChange={(e) => setNewCharacteristic(e.target.value)}
          />
          <Button type="submit" className="flex items-center gap-2" disabled={!newCharacteristic || !chatbotId}>
            <Plus />
            Add
          </Button>
        </form>

        <div className="flex flex-col-reverse gap-1">
          <AnimatePresence>
            {characteristics?.map((characteristic: ChatbotCharacteristic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                transition={{ duration: 0.25 }}
              >
                <Characteristic characteristic={characteristic} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
