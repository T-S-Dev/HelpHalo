"use client";

import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

import type { EmojiClickData } from "emoji-picker-react";

type Props = {
  value: string | null;
  onChange: (emoji: string) => void;
};

export default function EmojiInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <Popover open={true}>
      <PopoverTrigger ref={triggerRef} asChild>
        <Button onClick={() => setOpen(!open)} variant="outline" className="h-15 w-15 text-3xl">
          {value ? value : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={pickerRef} className={`${open ? "" : "hidden"}`}>
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </PopoverContent>
    </Popover>
  );
}
