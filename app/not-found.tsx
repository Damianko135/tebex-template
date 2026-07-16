import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="size-12 text-muted-foreground" strokeWidth={1.5} />
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">This page doesn&apos;t exist, or may have moved.</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button render={<Link href="/" />}>Return home</Button>
        <Button variant="outline" render={<Link href="/packages" />}>
          Browse packages
        </Button>
      </div>
    </div>
  );
}
