import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import type { Basket } from "@/lib/store/basket";
import { formatCurrency } from "@/lib/format";
import { StoreBreadcrumb, TrustSignals } from "@/themes/default/shared";

import { BasketDiscounts } from "./basket-discounts";
import { BasketPackages } from "./basket-packages";
import { CheckoutLink } from "./checkout-link";

/** The themed /basket page. Fetching and error-handling live in
 * app/(store)/basket/page.tsx; this component renders the basket itself
 * (or its empty state) once data is available. */
export function BasketPage({ basket }: { basket: Basket | null }) {
  if (!basket || !basket.packages || basket.packages.length === 0) {
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <StoreBreadcrumb className="mb-2" crumbs={[{ label: "Packages", href: "/packages" }, { label: "Basket" }]} />
      <h1 className="mb-10 font-heading text-3xl tracking-tight">Your basket</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <BasketPackages basketIdent={basket.ident ?? ""} packages={basket.packages} currency={basket.currency} />
          <BasketDiscounts
            basketIdent={basket.ident ?? ""}
            coupons={basket.coupons ?? []}
            giftcards={basket.giftcards ?? []}
            creatorCode={basket.creator_code}
          />
        </div>

        <div className="h-fit space-y-5 rounded-lg border border-border bg-card p-6 lg:col-span-1">
          <h2 className="font-heading text-lg">Order summary</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{basket.base_price !== undefined ? formatCurrency(basket.base_price, basket.currency) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sales tax</dt>
              <dd>{basket.sales_tax !== undefined ? formatCurrency(basket.sales_tax, basket.currency) : "—"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{basket.total_price !== undefined ? formatCurrency(basket.total_price, basket.currency) : "—"}</dd>
            </div>
          </dl>
          {basket.links?.checkout ? (
            <CheckoutLink href={basket.links.checkout} basketIdent={basket.ident ?? ""} />
          ) : (
            <p className="text-sm text-muted-foreground">Checkout is not available for this basket.</p>
          )}
          <TrustSignals />
        </div>
      </div>
    </div>
  );
}
