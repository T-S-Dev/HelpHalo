"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import { ChatbotBasicInfoSchema } from "@/features/admin/chatbot-editor/lib/ChatbotBasicInfoSchema";

import EmojiInput from "./EmojiInput";
import StatusToggle from "./StatusToggle";
import createChatbotAction from "../../actions/create-chatbot.action";
import updateChatbotAction from "../../actions/update-chatbot.action";

import type { Chatbot } from "@/types/client";
import type { ChatbotBasicInfo } from "@/features/admin/chatbot-editor/lib/ChatbotBasicInfoSchema";

type Props = {
  isEditing?: boolean;
  initialData?: Chatbot;
};

export default function ChatbotFormBasicInfo({ isEditing = false, initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(ChatbotBasicInfoSchema),
    defaultValues: {
      icon: initialData?.icon || "🤖",
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const createChatbot = async (data: ChatbotBasicInfo) => {
    const result = await createChatbotAction(data);

    if (result.success) {
      toast.success(result.data.message);
      router.push(`/edit-chatbot/${result.data.newChatbotId}`);
    } else {
      toast.error(result.error);
    }
  };

  const updateChatbot = async (data: ChatbotBasicInfo) => {
    if (!initialData?.id) return;

    const result = await updateChatbotAction(initialData.id, data);

    if (result.success) {
      toast.success(result.data.message);
      reset(data);
    } else {
      toast.error(result.error);
    }
  };

  const handleFormSubmit = async (data: ChatbotBasicInfo) => {
    startTransition(async () => {
      isEditing ? await updateChatbot(data) : await createChatbot(data);
    });
  };

  const isSubmitDisabled = isPending || isSubmitting || !isDirty;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl leading-none font-semibold tracking-tight">Basic Information</CardTitle>
        <CardDescription>Configure the core details of your chatbot</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Controller name="icon" control={control} render={({ field }) => <EmojiInput {...field} />} />
            {errors.icon && <p className="text-sm text-red-500">{errors.icon.message}</p>}
          </div>

          <Label htmlFor="name">Chatbot Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} autoFocus={!initialData?.name} placeholder="e.g., Customer Support Assistant" />
            )}
          />

          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder="Describe what your chatbot does..." rows={3} className="resize-none" />
            )}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => <StatusToggle initialValue={field.value} onChange={field.onChange} />}
          />
        </CardContent>

        <CardFooter>
          <Button type="submit" className="ml-auto flex items-center gap-2" disabled={isSubmitDisabled}>
            <Save className="h-4 w-4" />
            {isEditing ? (isPending ? "Updating..." : "Update Chatbot") : isPending ? "Creating..." : "Create Chatbot"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
