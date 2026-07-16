import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { PackageCard } from "@/components/store/package-card";
import { CategoryCard } from "@/components/store/category-card";
import { EmptyState } from "@/components/empty-state";
import { getCategoriesWithPackages, getCategory } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const [result, allResult] = await Promise.all([getCategory(categoryId), getCategoriesWithPackages()]);

  if (!result.ok) notFound();
  const category = result.data.data?.[0];
  if (!category) notFound();

  const allCategories = allResult.ok ? (allResult.data.data ?? []) : [];
  const subcategories = allCategories.filter(
    (candidate) => (candidate.parent as { id?: number } | null)?.id === category.id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/categories" className="hover:text-foreground">
          Categories
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{category.name}</span>
      </div>
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        {category.description && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </div>

      {subcategories.length > 0 && (
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {subcategories.map((sub) => (
            <CategoryCard key={sub.id} category={sub} />
          ))}
        </div>
      )}

      {!category.packages || category.packages.length === 0 ? (
        <EmptyState title="No packages in this category yet" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {category.packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
