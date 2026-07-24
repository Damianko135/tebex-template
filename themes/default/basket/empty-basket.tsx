import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

/** Rendered by `BasketPage` when the visitor has no basket yet, or an
 * existing one has no packages in it. */
export function EmptyBasket() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        icon={ShoppingCart}
        title="Your basket is empty"
        description="Add a package to get started."
        action={<Button render={<Link href="/packages" />}>Browse packages</Button>}
      />
    </div>
  );
}
