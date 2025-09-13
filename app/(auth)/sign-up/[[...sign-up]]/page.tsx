import { SignUp } from "@clerk/nextjs";
import { Bot } from "lucide-react";

export default async function SignUpPage() {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center gap-y-8">
      <div className="text-center">
        <div className="bg-primary/10 mb-4 inline-flex items-center justify-center rounded-full p-3">
          <Bot className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">HelpHalo</h1>
        <p className="text-muted-foreground mt-2">Create your account to get started</p>
      </div>

      <SignUp />

      <div className="text-muted-foreground text-center text-sm">
        <p>© {new Date().getFullYear()} HelpHalo. All rights reserved.</p>
      </div>
    </div>
  );
}
