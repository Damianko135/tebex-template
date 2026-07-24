import { Users } from "lucide-react";
import type { components } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { StoreBreadcrumb, StorePage, TrustSignals } from "@/themes/default/shared";

import { AddToBasketForm } from "./add-to-basket-form";
import { PackageGallery } from "./package-gallery";

type Package = components["schemas"]["Package"];

/** The themed package detail page. Fetching, the error case, and the
 * not-found case live in app/(store)/packages/[packageId]/page.tsx; this
 * component renders the package itself once data is available. */
export function PackageDetail({ pkg }: { pkg: Package }) {
  const hasDiscount = Boolean(pkg.discount && pkg.discount > 0);
  const gallery = pkg.media?.length ? pkg.media : pkg.image ? [{ url: pkg.image, name: pkg.name }] : [];
  const isExpired = pkg.expiration_date ? new Date(pkg.expiration_date) < new Date() : false;

  return (
    <StorePage>
      <StoreBreadcrumb
        crumbs={[
          { label: "Packages", href: "/packages" },
          ...(pkg.category
            ? [{ label: pkg.category.name ?? "", href: `/categories/${pkg.category.id}` }]
            : []),
          { label: pkg.name ?? "" },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <PackageGallery gallery={gallery} alt={pkg.name ?? "Package image"} />

        <div className="space-y-5">
          <div className="space-y-2">
            {pkg.type && (
              <Badge variant="secondary" className="capitalize">
                {pkg.type}
              </Badge>
            )}
            <h1 className="font-heading text-3xl tracking-tight">{pkg.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            {pkg.total_price !== undefined && (
              <span className="text-3xl font-semibold">
                {hasDiscount && <span className="sr-only">Sale price: </span>}
                {formatCurrency(pkg.total_price, pkg.currency)}
              </span>
            )}
            {hasDiscount && pkg.base_price !== undefined && (
              <span className="text-lg text-muted-foreground line-through">
                <span className="sr-only">Original price: </span>
                {formatCurrency(pkg.base_price, pkg.currency)}
              </span>
            )}
            {pkg.type === "subscription" && (
              <span className="text-sm text-muted-foreground">/ billing period</span>
            )}
          </div>

          {isExpired ? (
            <Badge variant="outline" className="border-destructive/40 text-destructive">
              No longer available
            </Badge>
          ) : (
            <div className="space-y-3">
              <AddToBasketForm
                packageId={pkg.id ?? ""}
                size="lg"
                showQuantity={!pkg.disable_quantity}
                disableQuantity={pkg.disable_quantity}
              />
              <TrustSignals />
            </div>
          )}

          {pkg.description && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-5"
              dangerouslySetInnerHTML={{ __html: pkg.description }}
            />
          )}

          <div className="flex flex-wrap gap-4 border-t border-border pt-5 text-sm text-muted-foreground">
            {pkg.user_limit != null && pkg.user_limit > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="size-4" /> Limit {pkg.user_limit} per customer
              </span>
            )}
            {pkg.expiration_date && !isExpired && (
              <span>Available until {formatDate(pkg.expiration_date)}</span>
            )}
            {pkg.disable_gifting && <span>Gifting is unavailable for this package</span>}
          </div>
        </div>
      </div>
    </StorePage>
  );
}
