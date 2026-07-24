import { PackageCard } from "@/components/store/package-card";

import { revealDelay } from "./reveal-delay";
import { SectionHeader } from "./section-header";
import type { Package } from "./types";

/** The homepage's "New arrivals" section. */
export function NewArrivals({ packages }: { packages: Package[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeader title="New arrivals" linkHref="/packages" linkLabel="Browse all packages" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
        {packages.map((pkg, index) => (
          <PackageCard key={pkg.id} pkg={pkg} style={revealDelay(index)} />
        ))}
      </div>
    </section>
  );
}
