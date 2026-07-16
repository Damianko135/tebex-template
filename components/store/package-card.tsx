import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { components } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

import { AddToBasketForm } from "./add-to-basket-form";

type Package = components["schemas"]["Package"];

export function PackageCard({ pkg }: { pkg: Package }) {
  const hasDiscount = Boolean(pkg.discount && pkg.discount > 0);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={`/packages/${pkg.id}`} className="relative block aspect-square overflow-hidden bg-muted">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.name ?? ""}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="size-8 text-muted-foreground/40" />
          </div>
        )}
        {pkg.type === "subscription" && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            Subscription
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 border-transparent bg-destructive text-white">
            Sale
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/packages/${pkg.id}`} className="font-medium leading-snug hover:underline">
          {pkg.name}
        </Link>
        {pkg.category?.name && (
          <span className="text-xs text-muted-foreground">{pkg.category.name}</span>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {pkg.total_price !== undefined && (
            <span className="text-lg font-semibold">{formatCurrency(pkg.total_price, pkg.currency)}</span>
          )}
          {hasDiscount && pkg.base_price !== undefined && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(pkg.base_price, pkg.currency)}
            </span>
          )}
        </div>
        <AddToBasketForm packageId={pkg.id ?? ""} size="sm" />
      </div>
    </div>
  );
}
