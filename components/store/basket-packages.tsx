"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { components } from "tebex-headless";

import { Button } from "@/components/ui/button";
import { initialActionState } from "@/lib/action-state";
import { formatCurrency } from "@/lib/format";
import { removeFromBasketAction, updateBasketQuantityAction } from "@/lib/store/actions";

type BasketPackage = components["schemas"]["BasketPackage"];

function QuantityStepper({
  basketIdent,
  packageId,
  quantity,
  disabled,
}: {
  basketIdent: string;
  packageId: number;
  quantity: number;
  disabled?: boolean;
}) {
  const [, action, isPending] = useActionState(updateBasketQuantityAction, initialActionState);

  if (disabled) {
    return <span className="w-16 text-center text-sm">Qty {quantity}</span>;
  }

  function step(delta: number) {
    const formData = new FormData();
    formData.set("basketIdent", basketIdent);
    formData.set("package_id", String(packageId));
    formData.set("quantity", String(Math.max(1, quantity + delta)));
    action(formData);
  }

  return (
    <div className="flex items-center rounded-md border border-border">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending || quantity <= 1}
        onClick={() => step(-1)}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="w-8 text-center text-sm">{quantity}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        onClick={() => step(1)}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}

function RemoveButton({ basketIdent, packageId }: { basketIdent: string; packageId: number }) {
  const [, action, isPending] = useActionState(removeFromBasketAction, initialActionState);

  return (
    <form action={action}>
      <input type="hidden" name="basketIdent" value={basketIdent} />
      <input type="hidden" name="package_id" value={packageId} />
      <Button type="submit" variant="ghost" size="icon-sm" disabled={isPending} aria-label="Remove item">
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </form>
  );
}

export function BasketPackages({
  basketIdent,
  packages,
  currency,
}: {
  basketIdent: string;
  packages: BasketPackage[];
  currency?: string;
}) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {packages.map((pkg) => (
        <li key={pkg.id} className="flex items-center gap-4 p-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            {pkg.image && <Image src={pkg.image} alt={pkg.name ?? ""} fill unoptimized className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/packages/${pkg.id}`} className="font-medium hover:underline">
              {pkg.name}
            </Link>
            {pkg.in_basket?.gift_username && (
              <p className="text-xs text-muted-foreground">Gift for {pkg.in_basket.gift_username}</p>
            )}
          </div>
          <QuantityStepper
            basketIdent={basketIdent}
            packageId={pkg.id ?? 0}
            quantity={pkg.in_basket?.quantity ?? 1}
            disabled={pkg.type === "subscription"}
          />
          <div className="w-20 text-right font-medium">
            {pkg.in_basket?.price !== undefined ? formatCurrency(pkg.in_basket.price, currency) : "—"}
          </div>
          <RemoveButton basketIdent={basketIdent} packageId={pkg.id ?? 0} />
        </li>
      ))}
    </ul>
  );
}
