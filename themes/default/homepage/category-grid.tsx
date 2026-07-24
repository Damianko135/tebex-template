import { CategoryCard } from "@/components/store/category-card";

import { revealDelay } from "./reveal-delay";
import { SectionHeader } from "./section-header";
import type { Category } from "./types";

/** The homepage's "Shop by category" section. */
export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeader title="Shop by category" linkHref="/categories" linkLabel="View all" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} style={revealDelay(index)} />
        ))}
      </div>
    </section>
  );
}
