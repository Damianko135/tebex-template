import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { BasketDiscounts } from "@/components/store/basket-discounts";
import { BasketPackages } from "@/components/store/basket-packages";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getCurrentBasket } from "@/lib/store/basket";

export const dynamic = "force-dynamic";

export default async function BasketPage() {
  const basket = await getCurrentBasket();

  if (!basket || !basket.packages || basket.packages.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Your basket is empty"
          description="Add a package to get started."
          action={
            <Button render={<Link href="/packages" />}>Browse packages</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your basket</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <BasketPackages basketIdent={basket.ident ?? ""} packages={basket.packages} currency={basket.currency} />
          <BasketDiscounts
            basketIdent={basket.ident ?? ""}
            coupons={basket.coupons ?? []}
            giftcards={basket.giftcards ?? []}
            creatorCode={basket.creator_code}
          />
        </div>

        <div className="space-y-4 rounded-lg border border-border p-5 lg:col-span-1">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{basket.base_price !== undefined ? formatCurrency(basket.base_price, basket.currency) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sales tax</dt>
              <dd>{basket.sales_tax !== undefined ? formatCurrency(basket.sales_tax, basket.currency) : "—"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{basket.total_price !== undefined ? formatCurrency(basket.total_price, basket.currency) : "—"}</dd>
            </div>
          </dl>
          {basket.links?.checkout ? (
            <Button size="lg" className="w-full" render={<a href={basket.links.checkout} />}>
              Proceed to checkout
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Checkout is not available for this basket.</p>
          )}
          <p className="text-center text-xs text-muted-foreground">
            Secure checkout is hosted by Tebex.
          </p>
        </div>
      </div>
    </div>
  );
}
