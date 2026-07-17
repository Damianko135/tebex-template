import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToBasketForm } from "@/components/store/add-to-basket-form";
import { PackageGallery } from "@/components/store/package-gallery";
import { StorePage } from "@/components/store/page-container";
import { StoreBreadcrumb } from "@/components/store/store-breadcrumb";
import { TrustSignals } from "@/components/store/trust-signals";
import { ErrorPanel } from "@/components/error-panel";
import { formatCurrency, formatDate, stripHtml } from "@/lib/format";
import { getPackage } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

type PackagePageProps = { params: Promise<{ packageId: string }> };

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { packageId } = await params;
  const result = await getPackage(packageId);
  const pkg = result.ok ? result.data : undefined;
  if (!pkg) return {};
  return {
    title: pkg.name,
    description: pkg.description ? stripHtml(pkg.description).slice(0, 160) : undefined,
    openGraph: pkg.image ? { images: [pkg.image] } : undefined,
  };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { packageId } = await params;
  const result = await getPackage(packageId);
  if (!result.ok) {
    return (
      <StorePage>
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href={`/packages/${packageId}`} />}>
              Try again
            </Button>
          }
        />
      </StorePage>
    );
  }

  const pkg = result.data;
  if (!pkg) notFound();

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
