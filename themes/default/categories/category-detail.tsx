import type { components } from "tebex-headless";

import { EmptyState } from "@/components/empty-state";
import type { getCategoriesWithPackages } from "@/lib/tebex/queries";
import { PackageCard } from "@/themes/default/packages";
import { StoreBreadcrumb, StorePage } from "@/themes/default/shared";

import { CategoryCard } from "./category-card";

type Category = components["schemas"]["Category"];
type AllCategoriesResult = Awaited<ReturnType<typeof getCategoriesWithPackages>>;

/** The themed category detail page. Fetching, the error case, and the
 * not-found case live in app/(store)/categories/[categoryId]/page.tsx; this
 * component renders the category itself once data is available. */
export function CategoryDetail({
  category,
  allCategoriesResult,
}: {
  category: Category;
  allCategoriesResult: AllCategoriesResult;
}) {
  const allCategories = allCategoriesResult.ok ? (allCategoriesResult.data.data ?? []) : [];
  // The schema declares `parent` as an empty `Record<string, never>` (same
  // underspecified-object issue as `Package.options`/`variables` elsewhere in
  // this codebase), so this narrows it to the shape the live API actually
  // returns.
  const subcategories = allCategories.filter(
    (candidate) => (candidate.parent as { id?: number } | null)?.id === category.id
  );

  return (
    <StorePage>
      <StoreBreadcrumb
        className="mb-2"
        crumbs={[{ label: "Categories", href: "/categories" }, { label: category.name ?? "" }]}
      />
      <div className="mb-8 space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">{category.name}</h1>
        {category.description && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </div>

      {subcategories.length > 0 && (
        <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
          {subcategories.map((sub) => (
            <CategoryCard key={sub.id} category={sub} />
          ))}
        </div>
      )}

      {!category.packages || category.packages.length === 0 ? (
        <EmptyState title="No packages in this category yet" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
          {category.packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </StorePage>
  );
}
