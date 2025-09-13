import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

import { DELETE_CHATBOT, UPDATE_CHATBOT } from "@/graphql/mutations";

export const useDeleteChatbot = () => {
  const router = useRouter();
  const [deleteChatbot, { loading }] = useMutation(DELETE_CHATBOT);

  const handleDelete = async (chatbotId: string, onSuccess?: () => void) => {
    try {
      await deleteChatbot({ variables: { id: chatbotId } });
      toast.success("Chatbot deleted successfully");
      onSuccess ? onSuccess() : router.refresh();
    } catch (error) {
      toast.error("Failed to delete chatbot");
    }
  };

  return { deleteChatbot: handleDelete, deleteLoading: loading };
};

export const useToggleChatbotStatus = () => {
  const router = useRouter();
  const [updateChatbot, { loading }] = useMutation(UPDATE_CHATBOT);

  const handleToggle = async (chatbotId: string, currentStatus: boolean) => {
    const toastId = toast.loading("Toggling status...");
    try {
      await updateChatbot({
        variables: { id: chatbotId, isActive: !currentStatus },
      });
      toast.success("Status toggled successfully", { id: toastId });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to toggle status", { id: toastId });
    }
  };

  return { toggleStatus: handleToggle, toggleLoading: loading };
};
