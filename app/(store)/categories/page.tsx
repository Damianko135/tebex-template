import { Boxes } from "lucide-react";

import { CategoryCard } from "@/components/store/category-card";
import { EmptyState } from "@/components/empty-state";
import { getCategoriesWithPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const result = await getCategoriesWithPackages();
  const categories = result.ok ? (result.data.data ?? []) : [];
  const topLevel = categories.filter((category) => !category.parent);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Browse everything the store has to offer.</p>
      </div>

      {topLevel.length === 0 ? (
        <EmptyState icon={Boxes} title="No categories yet" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topLevel.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
