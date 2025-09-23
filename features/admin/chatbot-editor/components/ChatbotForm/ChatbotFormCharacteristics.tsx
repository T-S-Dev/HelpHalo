"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

import Characteristic from "./Characteristic";
import addCharacteristic from "../../actions/add-characteristic.action";

import type { ChatbotCharacteristic } from "@/types/client";

type Props = {
  chatbotId: string;
  characteristics?: ChatbotCharacteristic[];
};

export default function ChatbotFormCharacteristics({ chatbotId, characteristics }: Props) {
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const [isAddPending, startAddTransition] = useTransition();

  const handleAddCharacteristic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacteristic.trim()) return;
    const contentToAdd = newCharacteristic;
    setNewCharacteristic("");

    startAddTransition(async () => {
      const result = await addCharacteristic(chatbotId, contentToAdd);
      if (!result.success) {
        toast.error(result.error);
        setNewCharacteristic(contentToAdd);
      }
    });
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
          <Button type="submit" className="flex items-center gap-2" disabled={!newCharacteristic || isAddPending}>
            <Plus />
            Add
          </Button>
        </form>

        <div className="flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {characteristics?.map((characteristic: ChatbotCharacteristic) => (
              <motion.div
                key={characteristic.id}
                initial={{ opacity: 1, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
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
