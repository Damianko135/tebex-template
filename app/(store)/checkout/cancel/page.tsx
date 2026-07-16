import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <XCircle className="mx-auto size-14 text-muted-foreground" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Checkout cancelled</h1>
      <p className="mt-2 text-muted-foreground">
        No payment was taken. Your basket is still saved if you&apos;d like to try again.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/basket" />}>Return to basket</Button>
        <Button variant="outline" render={<Link href="/packages" />}>
          Keep browsing
        </Button>
      </div>
    </div>
  );
}
