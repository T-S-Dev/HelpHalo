"use client";

import { useMutation } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DELETE_CHATBOT_CHARACTERISTIC } from "@/graphql/mutations";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries";
import { tryCatch } from "@/lib/tryCatch";

import type { ChatbotCharacteristic } from "@/types/client";

const Characteristic = ({ characteristic }: { characteristic: ChatbotCharacteristic }) => {
  const [deleteChatbotCharacteristic] = useMutation(DELETE_CHATBOT_CHARACTERISTIC, {
    update: (cache, data) => {
      // Read the existing data for this chatbot.
      const existingData: any = cache.readQuery({
        query: GET_CHATBOT_BY_ID,
        variables: { id: characteristic.chatbotId },
      });

      if (existingData && existingData.chatbot) {
        // Filter out the deleted characteristic.
        const newCharacteristics = existingData.chatbot.characteristics.filter(
          (c: ChatbotCharacteristic) => c.id !== characteristic.id,
        );

        // Write the updated data back to the cache.
        cache.writeQuery({
          query: GET_CHATBOT_BY_ID,
          variables: { id: characteristic.chatbotId },
          data: {
            chatbot: {
              ...existingData.chatbot,
              characteristics: newCharacteristics,
            },
          },
        });
      }
    },
    // Optimistic response: mimics the shape of the deletion response.
    optimisticResponse: {
      deleteChatbotCharacteristic: {
        __typename: "ChatbotCharacteristic",
        id: characteristic.id,
      },
    },
  });

  const handleDeleteCharacteristic = async () => {
    const [, error] = await tryCatch(
      deleteChatbotCharacteristic({
        variables: {
          id: characteristic.id,
        },
      }),
    );

    if (error) toast.error("Failed to delete characteristic");
  };

  return (
    <div className="border-muted-foreground flex w-full items-center justify-between rounded-md border px-3 py-2">
      <span>{characteristic.content}</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
        onClick={handleDeleteCharacteristic}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
};

export default Characteristic;
