import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { getAllPackages, getCategoriesWithPackages, getSidebarModules, getWebstore } from "@/lib/tebex/queries";
import { CategoryCard } from "@/themes/default/categories";
import { AddToBasketForm, PackageCard } from "@/themes/default/packages";

import { SectionHeader } from "./section-header";
import { StoreSidebarModule } from "./sidebar-module-card";

type WebstoreResult = Awaited<ReturnType<typeof getWebstore>>;
type Webstore = Extract<WebstoreResult, { ok: true }>["data"]["data"];

type CategoriesResult = Awaited<ReturnType<typeof getCategoriesWithPackages>>;

type PackagesResult = Awaited<ReturnType<typeof getAllPackages>>;
type Package = NonNullable<Extract<PackagesResult, { ok: true }>["data"]["data"]>[number];

type SidebarResult = Awaited<ReturnType<typeof getSidebarModules>>;

type FeaturedPackageData = { header: string; package: Package };

/** Staggers a grid item's `animate-fade-up` entrance (see globals.css) by
 * its position, capped so a long grid doesn't take forever to finish
 * revealing. */
function revealDelay(index: number, stepMs = 40, maxMs = 320): CSSProperties {
  return { animationDelay: `${Math.min(index * stepMs, maxMs)}ms` };
}

/** The themed homepage. Fetching and the webstore-fetch error case live in
 * app/(store)/page.tsx; this component composes the hero and every
 * data-dependent section once the webstore itself is available. */
export function Homepage({
  webstore,
  categoriesResult,
  packagesResult,
  sidebarResult,
}: {
  webstore: Webstore;
  categoriesResult: CategoriesResult;
  packagesResult: PackagesResult;
  sidebarResult: SidebarResult;
}) {
  const categories = categoriesResult.ok ? (categoriesResult.data.data ?? []) : [];
  const topLevelCategories = categories.filter((category) => !category.parent).slice(0, 8);
  const packages = packagesResult.ok ? (packagesResult.data.data ?? []) : [];
  const newArrivals = [...packages]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 8);

  const modules = sidebarResult.ok ? (sidebarResult.data.data ?? []) : [];
  const featuredModule = modules.find((module) => module.type === "featured_package") as
    | { type: "featured_package"; data: FeaturedPackageData }
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
