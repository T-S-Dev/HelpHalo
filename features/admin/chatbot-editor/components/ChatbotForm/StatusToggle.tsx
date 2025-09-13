"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import ChatbotStatusBadge from "@/features/admin/shared/components/ChatbotStatusBadge";

type Props = {
  initialValue: boolean;
  onChange?: (checked: boolean) => void;
};

export default function StatusToggle({ initialValue, onChange }: Props) {
  const [isActive, setIsActive] = useState(initialValue);

  const handleChange = (checked: boolean) => {
    setIsActive(checked);
    if (onChange) {
      onChange(checked);
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="status-toggle">Chatbot Status</Label>
        <ChatbotStatusBadge isActive={isActive} />
      </div>
      <Switch id="status-toggle" checked={isActive} onCheckedChange={handleChange} />
    </div>
  );
}
