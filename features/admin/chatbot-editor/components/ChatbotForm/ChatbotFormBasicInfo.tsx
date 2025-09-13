"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { CREATE_CHATBOT, UPDATE_CHATBOT } from "@/graphql/mutations";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries";

import EmojiInput from "@/features/admin/chatbot-editor/components/ChatbotForm/EmojiInput";
import StatusToggle from "@/features/admin/chatbot-editor/components/ChatbotForm/StatusToggle";
import { ChatbotBasicInfoSchema } from "@/features/admin/chatbot-editor/lib/ChatbotBasicInfoSchema";

import type { ChatbotBasicInfo } from "@/features/admin/chatbot-editor/lib/ChatbotBasicInfoSchema";
import type { Chatbot } from "@/types/client";

type Props = {
  isEditing?: boolean;
  initialData?: Chatbot;
};

export default function ChatbotFormBasicInfo({ isEditing = false, initialData }: Props) {
  const router = useRouter();

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

  const [createChatbot, { loading: createLoading }] = useMutation(CREATE_CHATBOT);
  const [updateChatbot, { loading: updateLoading }] = useMutation(UPDATE_CHATBOT, {
    update: (cache, { data: { updateChatbot } }) => {
      if (!initialData?.id) return;

      const existing = cache.readQuery<{ chatbot: Chatbot }>({
        query: GET_CHATBOT_BY_ID,
        variables: { id: initialData.id },
      });

      if (existing?.chatbot) {
        cache.writeQuery({
          query: GET_CHATBOT_BY_ID,
          variables: { id: initialData.id },
          data: { chatbot: { ...existing.chatbot, ...updateChatbot } },
        });
      }
    },
  });

  const handleFormSubmit = async (data: ChatbotBasicInfo) => {
    const action = isEditing
      ? () => updateChatbot({ variables: { id: initialData?.id, ...data } })
      : () => createChatbot({ variables: { ...data } });

    try {
      const response = await action();

      if (isEditing) {
        toast.success("Chatbot updated successfully");
        reset(data);
      } else {
        toast.success("Chatbot created successfully");
        router.push(`/edit-chatbot/${response.data.createChatbot.id}`);
      }
    } catch {
      toast.error(`Failed to ${isEditing ? "update" : "create"} chatbot`);
    }
  };

  const isLoading = createLoading || updateLoading;
  const isSubmitDisabled = isLoading || isSubmitting || !isDirty;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Basic Information</CardTitle>
        <CardDescription>Configure the core details of your chatbot</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Controller
            name="icon"
            control={control}
            render={({ field: { value, onChange } }) => <EmojiInput value={value} onChange={onChange} />}
          />
          {errors.icon && <p className="text-sm text-red-500">{errors.icon.message}</p>}
        </div>

        <Label htmlFor="name">Chatbot Name</Label>
        <Input id="name" autoFocus placeholder="e.g., Customer Support Assistant" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what your chatbot does..."
          rows={3}
          {...register("description")}
          className="resize-none"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => <StatusToggle initialValue={value} onChange={onChange} />}
        />
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          className="ml-auto flex items-center gap-2"
          disabled={isSubmitDisabled}
        >
          <Save className="h-4 w-4" />
          {isEditing ? (isLoading ? "Updating..." : "Update Chatbot") : isLoading ? "Creating..." : "Create Chatbot"}
        </Button>
      </CardFooter>
    </Card>
  );
}
