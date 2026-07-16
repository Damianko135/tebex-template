import { LayoutPanelTop } from "lucide-react";

import { EmptyState } from "@/components/admin/empty-state";
import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { SidebarModuleCard } from "@/components/admin/sidebar-module-card";
import { getSidebarModules } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function SidebarModulesPage() {
  const result = await getSidebarModules();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Sidebar modules" }]}
        title="Sidebar modules"
        description="Modules configured for your storefront's sidebar (Webstore > Design > Modules in the Tebex control panel)."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} />
      ) : !result.data.data || result.data.data.length === 0 ? (
        <EmptyState
          icon={LayoutPanelTop}
          title="No sidebar modules configured"
          description="Add modules from the Tebex control panel under Webstore > Design > Modules."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.data.map((module) => (
            <SidebarModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}
