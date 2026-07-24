import type { Basket } from "@/lib/store/basket";
import { formatCurrency } from "@/lib/format";
import { TrustSignals } from "@/themes/default/shared";

import { CheckoutLink } from "./checkout-link";

/** The basket page's order-summary aside: price breakdown, the checkout CTA
 * (or a fallback message when the basket has no checkout link yet), and the
 * shared trust-signal reassurance copy. */
export function CheckoutSummary({ basket }: { basket: Basket }) {
  return (
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
  );
}
