"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import startNewChatAction from "../actions/start-new-chat.action";
import { UserInfoSchema } from "../lib/UserInfoSchema";

import type { UserInfo } from "../lib/UserInfoSchema";
import type { StartNewChatResult } from "../actions/start-new-chat.action";
import type { ChatbotPublic } from "@/types/shared";

type Props = {
  chatbot: ChatbotPublic;
  onSessionStart: (res: StartNewChatResult) => void;
  isOpen: boolean;
};

export default function UserInfoDialog({ chatbot, onSessionStart, isOpen }: Props) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfo>({
    resolver: zodResolver(UserInfoSchema),
  });

  const onSubmit = async (data: UserInfo) => {
    setServerError(null);
    startTransition(async () => {
      const result = await startNewChatAction(chatbot.id, data);
      result.success ? onSessionStart(result.data) : setServerError(result.error);
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to {chatbot.name}</DialogTitle>
          <DialogDescription>Please enter your name & email to start.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 pb-4">
            {serverError && <p className="text-destructive text-sm">{serverError}</p>}
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Your name" />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input {...register("email")} placeholder="you@example.com" />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Starting..." : "Start Chatting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
