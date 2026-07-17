import { notFound } from "next/navigation";
import Link from "next/link";

import { ErrorPanel } from "@/components/error-panel";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PackageTable } from "@/components/admin/package-table";
import { PageHeader } from "@/components/admin/page-header";
import { PropertyGrid } from "@/components/admin/property-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategory } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const result = await getCategory(categoryId);

  if (!result.ok) {
    return (
      <div className="space-y-6">
        <PageHeader
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Categories", href: "/admin/categories" },
            { label: categoryId },
          ]}
          title={categoryId}
        />
        <ErrorPanel error={result.error} />
      </div>
    );
  }

  const category = result.data;
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories", href: "/admin/categories" },
          { label: category.name ?? categoryId },
        ]}
        title={category.name ?? categoryId}
        description={category.slug ? `/${category.slug}` : undefined}
      />

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyGrid value={category} exclude={["packages", "description"]} columns={3} />
        </CardContent>
      </Card>

      {category.parent && (
        <Card>
          <CardHeader>
            <CardTitle>Parent category</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyGrid value={category.parent} columns={3} />
          </CardContent>
        </Card>
      )}

      {category.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border p-4"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Packages ({category.packages?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <PackageTable packages={category.packages ?? []} />
        </CardContent>
      </Card>

      <JSONViewer data={category} label="Raw category" />

      <p className="text-xs text-muted-foreground">
        Looking for dynamic-category packages scoped to a specific basket? Use the{" "}
        <Link href="/admin/baskets" className="underline">
          basket explorer
        </Link>
        .
      </p>
    </div>
  );
}
