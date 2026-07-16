import Link from "next/link";
import { Boxes } from "lucide-react";
import type { components } from "tebex-headless";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { EnumBadge } from "@/components/admin/status-badge";
import { getCategoriesWithPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

type Category = components["schemas"]["Category"];

const columns: DataTableColumn<Category>[] = [
  {
    id: "name",
    header: "Name",
    render: (category) => (
      <Link href={`/admin/categories/${category.id}`} className="font-medium hover:underline">
        {category.name}
      </Link>
    ),
    sortValue: (category) => category.name?.toLowerCase() ?? "",
  },
  {
    id: "slug",
    header: "Slug",
    render: (category) => (
      <span className="font-mono text-xs text-muted-foreground">{category.slug ?? "—"}</span>
    ),
  },
  {
    id: "display_type",
    header: "Display",
    render: (category) => (category.display_type ? <EnumBadge value={category.display_type} /> : "—"),
  },
  {
    id: "packages",
    header: "Packages",
    render: (category) => category.packages?.length ?? 0,
    sortValue: (category) => category.packages?.length ?? 0,
  },
  {
    id: "flags",
    header: "Flags",
    render: (category) => (
      <div className="flex flex-wrap gap-1.5">
        {category.tiered && <EnumBadge value="tiered" tone="success" />}
        {category.dynamic && <EnumBadge value="dynamic" tone="warning" />}
      </div>
    ),
  },
  {
    id: "order",
    header: "Order",
    render: (category) => category.order ?? "—",
    sortValue: (category) => category.order ?? 0,
  },
];

export default async function CategoriesListPage() {
  const result = await getCategoriesWithPackages();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Categories" }]}
        title="Categories"
        description="Storefront categories, including their packages."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} />
      ) : !result.data.data || result.data.data.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No categories"
          description="Create categories from the Tebex control panel under Webstore > Categories."
        />
      ) : (
        <DataTable
          data={result.data.data}
          columns={columns}
          getRowId={(category) => String(category.id)}
          searchPlaceholder="Search categories..."
          searchFn={(category, query) =>
            (category.name?.toLowerCase().includes(query) ?? false) ||
            (category.slug?.toLowerCase().includes(query) ?? false)
          }
        />
      )}
    </div>
  );
}
