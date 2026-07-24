import Image from "next/image";
import Link from "next/link";

import { AddToBasketForm } from "@/components/store/add-to-basket-form";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

import type { FeaturedPackageData } from "./types";

/** The homepage's highlighted-package banner, sourced from the /sidebar
 * "featured_package" module. */
export function FeaturedPackage({ module }: { module: FeaturedPackageData }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-2">
        <div className="relative aspect-video bg-muted md:aspect-auto">
          {module.package.image && (
            <Image
              src={module.package.image}
              alt={module.package.name ?? ""}
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-center gap-3 p-10">
          <span className="text-xs font-medium tracking-wide text-primary uppercase">
            {module.header}
          </span>
          <h2 className="font-heading text-2xl">{module.package.name}</h2>
          {module.package.total_price !== undefined && (
            <p className="text-2xl font-medium">
              {formatCurrency(module.package.total_price, module.package.currency)}
            </p>
          )}
          <div className="flex gap-3 pt-3">
            <Button variant="outline" render={<Link href={`/packages/${module.package.id}`} />}>
              View details
            </Button>
            <AddToBasketForm packageId={module.package.id ?? ""} className="w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
