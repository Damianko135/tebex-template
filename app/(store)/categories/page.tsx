import Link from "next/link";
import { Boxes } from "lucide-react";

import { CategoryCard } from "@/components/store/category-card";
import { PageHeading } from "@/components/store/page-heading";
import { StorePage } from "@/components/store/page-container";
import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { getCategoriesWithPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const result = await getCategoriesWithPackages();
  const topLevel = result.ok ? (result.data.data ?? []).filter((category) => !category.parent) : [];

  return (
    <StorePage>
      <PageHeading title="Categories" description="Browse everything the store has to offer." />

      {!result.ok ? (
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href="/categories" />}>
              Try again
            </Button>
          }
        />
      ) : topLevel.length === 0 ? (
        <EmptyState icon={Boxes} title="No categories yet" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
          {topLevel.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </StorePage>
  );
}
