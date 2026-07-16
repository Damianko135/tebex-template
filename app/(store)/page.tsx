import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryCard } from "@/components/store/category-card";
import { PackageCard } from "@/components/store/package-card";
import { StoreSidebarModule } from "@/components/store/sidebar-module-card";
import { AddToBasketForm } from "@/components/store/add-to-basket-form";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import {
  getAllPackages,
  getCategoriesWithPackages,
  getSidebarModules,
  getWebstore,
} from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [webstoreResult, categoriesResult, packagesResult, sidebarResult] = await Promise.all([
    getWebstore(),
    getCategoriesWithPackages(),
    getAllPackages(),
    getSidebarModules(),
  ]);

  if (!webstoreResult.ok) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Store not connected</h1>
        <p className="mt-2 text-muted-foreground">
          Set <code className="font-mono">TEBEX_STORE_TOKEN</code> in your environment to bring this
          storefront to life.
        </p>
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
    <div className="space-y-20 pb-20">
      <section className="relative overflow-hidden border-b border-border bg-linear-to-br from-primary/10 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{webstore?.name}</h1>
            {webstore?.description && (
              <div
                className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: webstore.description }}
              />
            )}
            <div className="flex flex-wrap gap-3 pt-2">
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
          <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2">
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
            <div className="flex flex-col justify-center gap-3 p-8">
              <span className="text-xs font-medium tracking-wide text-primary uppercase">
                {featuredModule.data.header}
              </span>
              <h2 className="text-2xl font-semibold">{featuredModule.data.package.name}</h2>
              {featuredModule.data.package.total_price !== undefined && (
                <p className="text-2xl font-semibold">
                  {formatCurrency(featuredModule.data.package.total_price, featuredModule.data.package.currency)}
                </p>
              )}
              <div className="flex gap-3 pt-2">
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
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Shop by category</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {topLevelCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">New arrivals</h2>
            <Link href="/packages" className="text-sm text-primary hover:underline">
              Browse all packages
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {otherModules.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherModules.map((module) => (
              <StoreSidebarModule key={module.id} module={module} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
