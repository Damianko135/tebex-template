import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getCurrentBasket } from "@/lib/store/basket";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage() {
  // Payment has already succeeded by the time this page renders - if the
  // basket refetch itself fails, this deliberately still shows the "Thank
  // you" confirmation and just omits the order summary below, rather than
  // surfacing an error on what should be a reassuring, low-anxiety moment.
  const basketResult = await getCurrentBasket();
  const basket = basketResult.ok ? basketResult.data : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto size-14 text-success" />
      <h1 className="mt-6 font-heading text-3xl tracking-tight">Thank you for your purchase.</h1>
      <p className="mt-2 text-muted-foreground">
        Your order has been received. Most packages deliver automatically in-game within minutes.
      </p>

      {basket?.packages && basket.packages.length > 0 && (
        <div className="mt-8 space-y-2 rounded-lg border border-border p-5 text-left">
          {basket.packages.map((pkg) => (
            <div key={pkg.id} className="flex justify-between text-sm">
              <span>
                {pkg.name} {pkg.in_basket?.quantity && pkg.in_basket.quantity > 1 ? `× ${pkg.in_basket.quantity}` : ""}
              </span>
              <span>{pkg.in_basket?.price !== undefined ? formatCurrency(pkg.in_basket.price, basket.currency) : ""}</span>
            </div>
          ))}
          {basket.total_price !== undefined && (
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <span>Total paid</span>
              <span>{formatCurrency(basket.total_price, basket.currency)}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/" />}>Continue shopping</Button>
        {basket?.links?.payment && (
          <Button variant="outline" render={<a href={basket.links.payment} target="_blank" rel="noreferrer" />}>
            View receipt <ExternalLink className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
