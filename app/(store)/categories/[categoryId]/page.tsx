import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PackageCard } from "@/components/store/package-card";
import { CategoryCard } from "@/components/store/category-card";
import { StorePage } from "@/components/store/page-container";
import { StoreBreadcrumb } from "@/components/store/store-breadcrumb";
import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { stripHtml } from "@/lib/format";
import { getCategoriesWithPackages, getCategory } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

type CategoryPageProps = { params: Promise<{ categoryId: string }> };

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const result = await getCategory(categoryId);
  const category = result.ok ? result.data : undefined;
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ? stripHtml(category.description).slice(0, 160) : undefined,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const [result, allResult] = await Promise.all([getCategory(categoryId), getCategoriesWithPackages()]);

  if (!result.ok) {
    return (
      <StorePage>
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href={`/categories/${categoryId}`} />}>
              Try again
            </Button>
          }
        />
      </StorePage>
    );
  }
  const category = result.data;
  if (!category) notFound();

  const allCategories = allResult.ok ? (allResult.data.data ?? []) : [];
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
