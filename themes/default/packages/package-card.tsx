import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { components } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

import { AddToBasketForm } from "./add-to-basket-form";

type Package = components["schemas"]["Package"];

export function PackageCard({
  pkg,
  style,
}: {
  pkg: Package;
  /** Used by call sites to stagger this card's entrance animation. */
  style?: CSSProperties;
}) {
  const hasDiscount = Boolean(pkg.discount && pkg.discount > 0);

  return (
    <Card className="@container/pcard group animate-fade-up gap-0 overflow-hidden rounded-lg py-0" style={style}>
      <Link href={`/packages/${pkg.id}`} className="relative block aspect-square overflow-hidden bg-muted">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.name ?? "Package image"}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
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
          <Badge className="absolute top-2 right-2 border-transparent bg-destructive text-destructive-foreground">
            Sale
          </Badge>
        )}
      </Link>
      {/* Padding and title size respond to the card's own rendered width
          (auto-fill grid, see themes/default/homepage/homepage.tsx), not
          the viewport. */}
      <CardContent className="flex flex-1 flex-col gap-2 py-4 @sm/pcard:gap-2.5 @sm/pcard:py-5">
        <Link
          href={`/packages/${pkg.id}`}
          className="font-heading leading-snug transition-colors hover:text-primary @sm/pcard:text-lg"
        >
          {pkg.name}
        </Link>
        {pkg.category?.name && (
          <span className="text-xs text-muted-foreground">{pkg.category.name}</span>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {pkg.total_price !== undefined && (
            <span className="text-lg font-medium">
              {hasDiscount && <span className="sr-only">Sale price: </span>}
              {formatCurrency(pkg.total_price, pkg.currency)}
            </span>
          )}
          {hasDiscount && pkg.base_price !== undefined && (
            <span className="text-sm text-muted-foreground line-through">
              <span className="sr-only">Original price: </span>
              {formatCurrency(pkg.base_price, pkg.currency)}
            </span>
          )}
        </div>
        <AddToBasketForm packageId={pkg.id ?? ""} size="sm" />
      </CardContent>
    </Card>
  );
}
