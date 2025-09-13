import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Halo — Build and manage AI chatbots",
  description: "Create, customize, and deploy your AI chatbots with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex min-h-screen flex-col">
          <NuqsAdapter>
            <Toaster
              position="bottom-right"
              richColors
              expand={true}
              duration={2000}
              visibleToasts={3}
              toastOptions={{
                classNames: {
                  toast: "!border-none",
                  error: "!bg-red-600 !text-white",
                  success: "!bg-green-600 !text-white",
                },
              }}
            />
            {children}
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  );
}
