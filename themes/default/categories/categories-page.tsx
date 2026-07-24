import Link from "next/link";
import { Boxes } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import type { getCategoriesWithPackages } from "@/lib/tebex/queries";
import { PageHeading, StorePage } from "@/themes/default/shared";

import { CategoryCard } from "./category-card";

type CategoriesResult = Awaited<ReturnType<typeof getCategoriesWithPackages>>;

/** The themed /categories listing page. Fetching lives in
 * app/(store)/categories/page.tsx; this component owns the error, empty,
 * and grid states, since all three share the same heading/wrapper layout. */
export function CategoriesPage({ result }: { result: CategoriesResult }) {
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
