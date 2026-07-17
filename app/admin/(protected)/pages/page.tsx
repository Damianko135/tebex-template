import { FileText } from "lucide-react";

import { CMSPageTable } from "@/components/admin/cms-page-table";
import { ErrorPanel } from "@/components/error-panel";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { getCustomPages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function PagesListPage() {
  const result = await getCustomPages();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pages" }]}
        title="Pages"
        description="Custom pages defined for your webstore."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} audience="admin" />
      ) : !result.data.data || result.data.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No custom pages"
          description="Create custom pages from the Tebex control panel under Webstore > Pages."
        />
      ) : (
        <CMSPageTable pages={result.data.data} />
      )}
    </div>
  );
}
