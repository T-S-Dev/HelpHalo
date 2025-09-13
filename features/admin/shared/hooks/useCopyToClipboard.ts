import { useState } from "react";
import { toast } from "sonner";

type UseCopyToClipboardOptions = {
  showToast?: boolean;
  copiedDuration?: number;
}

export function useCopyToClipboard({ showToast = false, copiedDuration = 1000 }: UseCopyToClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (showToast) {
        toast.success("Copied to clipboard");
      }

      setTimeout(() => {
        setCopied(false);
      }, copiedDuration);
    } catch (error) {
      console.error("Failed to copy:", error);
      if (showToast) {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  return {
    copied,
    copyToClipboard,
  };
}
