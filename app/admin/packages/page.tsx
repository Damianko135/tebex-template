import { Package } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { PackageTable } from "@/components/admin/package-table";
import { PageHeader } from "@/components/admin/page-header";
import { getAllPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function PackagesListPage() {
  const result = await getAllPackages();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Packages" }]}
        title="Packages"
        description="Every package available in your webstore (excluding dynamic-category packages, which are basket-scoped)."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} />
      ) : !result.data.data || result.data.data.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No packages"
          description="Create packages from the Tebex control panel under Webstore > Packages."
        />
      ) : (
        <PackageTable packages={result.data.data} showCategory />
      )}
    </div>
  );
}
