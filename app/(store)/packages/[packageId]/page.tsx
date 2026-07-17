import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ImageOff, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AddToBasketForm } from "@/components/store/add-to-basket-form";
import { formatCurrency, formatDate, stripHtml } from "@/lib/format";
import { getPackage } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

type PackagePageProps = { params: Promise<{ packageId: string }> };

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { packageId } = await params;
  const result = await getPackage(packageId);
  const pkg = result.ok ? result.data.data?.[0] : undefined;
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
  if (!result.ok) notFound();

  const pkg = result.data.data?.[0];
  if (!pkg) notFound();

  const hasDiscount = Boolean(pkg.discount && pkg.discount > 0);
  const gallery = pkg.media?.length ? pkg.media : pkg.image ? [{ url: pkg.image, name: pkg.name }] : [];
  const isExpired = pkg.expiration_date ? new Date(pkg.expiration_date) < new Date() : false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/packages" className="hover:text-foreground">
          Packages
        </Link>
        <ChevronRight className="size-3.5" />
        {pkg.category && (
          <>
            <Link href={`/categories/${pkg.category.id}`} className="hover:text-foreground">
              {pkg.category.name}
            </Link>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <span className="text-foreground">{pkg.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            {gallery[0]?.url ? (
              <Image src={gallery[0].url} alt={pkg.name ?? ""} fill unoptimized className="object-cover" />
            ) : (
              <ImageOff className="absolute inset-0 m-auto size-10 text-muted-foreground/40" />
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.slice(1, 5).map((media, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                  {media.url && (
                    <Image src={media.url} alt={media.name ?? ""} fill unoptimized className="object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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
              <span className="text-3xl font-semibold">{formatCurrency(pkg.total_price, pkg.currency)}</span>
            )}
            {hasDiscount && pkg.base_price !== undefined && (
              <span className="text-lg text-muted-foreground line-through">
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
            <AddToBasketForm
              packageId={pkg.id ?? ""}
              size="lg"
              showQuantity={!pkg.disable_quantity}
              disableQuantity={pkg.disable_quantity}
            />
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
            {pkg.disable_gifting && <span>Gifting not available for this package</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
