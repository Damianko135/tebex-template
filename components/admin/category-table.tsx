"use client";

import Link from "next/link";
import type { components } from "tebex-headless";

import { DataTable, type DataTableColumn } from "./data-table";
import { EnumBadge } from "./status-badge";

type Category = components["schemas"]["Category"];

/** Reused by the admin categories list page. */
export function CategoryTable({ categories }: { categories: Category[] }) {
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

  return (
    <DataTable
      data={categories}
      columns={columns}
      getRowId={(category) => String(category.id)}
      searchPlaceholder="Search categories..."
      searchFn={(category, query) =>
        (category.name?.toLowerCase().includes(query) ?? false) ||
        (category.slug?.toLowerCase().includes(query) ?? false)
      }
    />
  );
}
