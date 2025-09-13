import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background-hover flex flex-1 flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="text-4xl font-bold">404 - Page Not Found</h2>
        <p className="text-muted-foreground mt-4 text-lg">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button className="mt-6 h-12 px-6 py-3 text-lg font-semibold">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
