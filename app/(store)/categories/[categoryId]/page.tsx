import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { stripHtml } from "@/lib/format";
import { getCategoriesWithPackages, getCategory } from "@/lib/tebex/queries";
import { CategoryDetail } from "@/themes/default/categories";
import { StorePage } from "@/themes/default/shared";

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

export default async function Page({ params }: CategoryPageProps) {
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

  return <CategoryDetail category={category} allCategoriesResult={allResult} />;
}
