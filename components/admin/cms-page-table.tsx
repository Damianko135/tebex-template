"use client";

import Link from "next/link";
import type { components } from "tebex-headless";

import { formatDate } from "@/lib/format";

import { DataTable, type DataTableColumn } from "./data-table";
import { BooleanBadge } from "./status-badge";

type CMSPage = components["schemas"]["CMSPage"];

/** Reused by the admin CMS pages list page. */
export function CMSPageTable({ pages }: { pages: CMSPage[] }) {
  const columns: DataTableColumn<CMSPage>[] = [
    {
      id: "title",
      header: "Title",
      render: (page) => (
        <Link href={`/admin/pages/${page.slug}`} className="font-medium hover:underline">
          {page.title}
        </Link>
      ),
      sortValue: (page) => page.title?.toLowerCase() ?? "",
    },
    {
      id: "slug",
      header: "Slug",
      render: (page) => <span className="font-mono text-xs">{page.slug}</span>,
    },
    {
      id: "visibility",
      header: "Visibility",
      render: (page) => (
        <div className="flex gap-1.5">
          <BooleanBadge value={!page.hidden} trueLabel="Visible" falseLabel="Hidden" />
          {page.private && <BooleanBadge value={true} trueLabel="Private" />}
          {page.disabled && <BooleanBadge value={false} falseLabel="Disabled" />}
        </div>
      ),
    },
    {
      id: "updated_at",
      header: "Updated",
      render: (page) => (page.updated_at ? formatDate(page.updated_at) : "—"),
      sortValue: (page) => page.updated_at ?? "",
    },
  ];

  return (
    <DataTable
      data={pages}
      columns={columns}
      getRowId={(page) => String(page.id)}
      searchPlaceholder="Search pages..."
      searchFn={(page, query) =>
        (page.title?.toLowerCase().includes(query) ?? false) ||
        (page.slug?.toLowerCase().includes(query) ?? false)
      }
    />
  );
}
