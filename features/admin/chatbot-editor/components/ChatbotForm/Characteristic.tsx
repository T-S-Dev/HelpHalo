"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import deleteCharacteristicAction from "../../actions/delete-characteristic.action";

import type { ChatbotCharacteristic } from "@/types/client";

type Props = {
  characteristic: ChatbotCharacteristic;
};

const Characteristic = ({ characteristic }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCharacteristicAction(characteristic.id, characteristic.chatbotId);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="border-muted-foreground flex w-full items-center justify-between rounded-md border px-3 py-2">
      <span className="pr-2 break-words">{characteristic.content}</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0 p-0"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
};

export default Characteristic;
