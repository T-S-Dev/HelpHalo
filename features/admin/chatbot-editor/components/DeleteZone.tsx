import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DeleteConfirmationDialog from "@/features/admin/shared/components/DeleteConfirmationDialog";
import deleteChatbotAction from "@/features/admin/shared/actions/delete-chatbot.action";

export default function DeleteZone({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteChatbotAction(id);
      if (result.success) {
        toast.success(result.data.message);
        router.push("/dashboard");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 text-2xl leading-none font-bold tracking-tight">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-destructive/20 border-destructive/40 rounded-lg border p-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-medium">Delete this chatbot</h3>
              <p className="text-muted-foreground mt-1 text-sm">Once deleted, this action cannot be undone.</p>
            </div>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Chatbot
            </Button>
            <DeleteConfirmationDialog
              isOpen={isDeleteModalOpen}
              onCancel={() => setIsDeleteModalOpen(false)}
              onDelete={handleDelete}
              resourceName="Chatbot"
              resourceDisplayName={name}
              deleteLoading={isPending}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
