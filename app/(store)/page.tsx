import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryCard } from "@/components/store/category-card";
import { PackageCard } from "@/components/store/package-card";
import { SectionHeader } from "@/components/store/section-header";
import { StoreSidebarModule } from "@/components/store/sidebar-module-card";
import { AddToBasketForm } from "@/components/store/add-to-basket-form";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import {
  getAllPackages,
  getCategoriesWithPackages,
  getSidebarModules,
  getWebstore,
} from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

/** Staggers a grid item's `animate-fade-up` entrance (see globals.css) by
 * its position, capped so a long grid doesn't take forever to finish
 * revealing. */
function revealDelay(index: number, stepMs = 40, maxMs = 320): CSSProperties {
  return { animationDelay: `${Math.min(index * stepMs, maxMs)}ms` };
}

export default async function HomePage() {
  const [webstoreResult, categoriesResult, packagesResult, sidebarResult] = await Promise.all([
    getWebstore(),
    getCategoriesWithPackages(),
    getAllPackages(),
    getSidebarModules(),
  ]);

  if (!webstoreResult.ok) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <ErrorPanel error={webstoreResult.error} />
      </div>
    );
  }

  const webstore = webstoreResult.data.data;
  const categories = categoriesResult.ok ? (categoriesResult.data.data ?? []) : [];
  const topLevelCategories = categories.filter((category) => !category.parent).slice(0, 8);
  const packages = packagesResult.ok ? (packagesResult.data.data ?? []) : [];
  const newArrivals = [...packages]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 8);

  const modules = sidebarResult.ok ? (sidebarResult.data.data ?? []) : [];
  const featuredModule = modules.find((module) => module.type === "featured_package") as
    | { type: "featured_package"; data: { header: string; package: (typeof packages)[number] } }
    | undefined;
  const otherModules = modules.filter((module) => module.type !== "featured_package");

  return (
    <div className="space-y-24 pb-24">
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl space-y-7">
            <h1 className="animate-fade-up font-display text-display-lg text-balance">
              {webstore?.name}
            </h1>
            {webstore?.description && (
              <div
                className="prose prose-sm sm:prose-base dark:prose-invert max-w-2xl animate-fade-up text-muted-foreground"
                style={revealDelay(1, 80)}
                dangerouslySetInnerHTML={{ __html: webstore.description }}
              />
            )}
            <div className="animate-fade-up flex flex-wrap gap-3 pt-3" style={revealDelay(2, 80)}>
              <Button size="lg" render={<Link href="/categories" />}>
                Shop now <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/packages" />}>
                Browse all packages
              </Button>
            </div>
          </div>
        </div>
      </section>

      {featuredModule && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-2">
            <div className="relative aspect-video bg-muted md:aspect-auto">
              {featuredModule.data.package.image && (
                <Image
                  src={featuredModule.data.package.image}
                  alt={featuredModule.data.package.name ?? ""}
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-3 p-10">
              <span className="text-xs font-medium tracking-wide text-primary uppercase">
                {featuredModule.data.header}
              </span>
              <h2 className="font-heading text-2xl">{featuredModule.data.package.name}</h2>
              {featuredModule.data.package.total_price !== undefined && (
                <p className="text-2xl font-medium">
                  {formatCurrency(featuredModule.data.package.total_price, featuredModule.data.package.currency)}
                </p>
              )}
              <div className="flex gap-3 pt-3">
                <Button variant="outline" render={<Link href={`/packages/${featuredModule.data.package.id}`} />}>
                  View details
                </Button>
                <AddToBasketForm packageId={featuredModule.data.package.id ?? ""} className="w-auto" />
              </div>
            </div>
          </div>
        </section>
      )}

      {topLevelCategories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader title="Shop by category" linkHref="/categories" linkLabel="View all" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
            {topLevelCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} style={revealDelay(index)} />
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader title="New arrivals" linkHref="/packages" linkLabel="Browse all packages" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
            {newArrivals.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} style={revealDelay(index)} />
            ))}
          </div>
        </section>
      )}

      {otherModules.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
            {otherModules.map((module) => (
              <StoreSidebarModule key={module.id} module={module} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
