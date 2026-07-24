import type { Basket } from "@/lib/store/basket";
import { StoreBreadcrumb } from "@/themes/default/shared";

import { BasketDiscounts } from "./basket-discounts";
import { BasketPackages } from "./basket-packages";
import { CheckoutSummary } from "./checkout-summary";
import { EmptyBasket } from "./empty-basket";

/** The themed /basket page. Fetching and error-handling live in
 * app/(store)/basket/page.tsx; this component renders the basket itself
 * (or its empty state) once data is available. */
export function BasketPage({ basket }: { basket: Basket | null }) {
  if (!basket || !basket.packages || basket.packages.length === 0) {
    return <EmptyBasket />;
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

        <CheckoutSummary basket={basket} />
      </div>
    </div>
  );
}
