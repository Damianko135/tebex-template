import Link from "next/link";
import { FileText } from "lucide-react";

import type { components } from "tebex-headless";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ErrorPanel } from "@/components/error-panel";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { BooleanBadge } from "@/components/admin/status-badge";
import { getCustomPages } from "@/lib/tebex/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type CMSPage = components["schemas"]["CMSPage"];

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
  { id: "slug", header: "Slug", render: (page) => <span className="font-mono text-xs">{page.slug}</span> },
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

export default async function PagesListPage() {
  const result = await getCustomPages();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pages" }]}
        title="CMS pages"
        description="Custom pages defined for your webstore."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} />
      ) : !result.data.data || result.data.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No custom pages"
          description="Create custom pages from the Tebex control panel under Webstore > Pages."
        />
      ) : (
        <DataTable
          data={result.data.data}
          columns={columns}
          getRowId={(page) => String(page.id)}
          searchPlaceholder="Search pages..."
          searchFn={(page, query) =>
            (page.title?.toLowerCase().includes(query) ?? false) ||
            (page.slug?.toLowerCase().includes(query) ?? false)
          }
        />
      )}
    </div>
  );
}
