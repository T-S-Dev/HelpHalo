"use client";

import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useCopyToClipboard } from "@/features/admin/shared/hooks/useCopyToClipboard";

export default function LinkToChatbot({ link }: { link: string }) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl leading-none font-semibold tracking-tight">Link to Chat</CardTitle>
        <CardDescription>Share this link with your customers to start conversations with your chatbot</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input readOnly value={link} className="focus:!ring-0" />
          <Button variant="outline" asChild className="flex aspect-square items-center gap-2 sm:aspect-auto">
            <Link href={link} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => copyToClipboard(link)}
            className="flex aspect-square items-center gap-2 sm:aspect-auto"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
