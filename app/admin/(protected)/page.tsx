import Link from "next/link";
import { Boxes, ExternalLink, FileText, Package } from "lucide-react";

import { MetricCard, StatGrid } from "@/components/admin/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { ErrorPanel } from "@/components/error-panel";
import { Badge } from "@/components/ui/badge";
import { getAllPackages, getCategories, getCustomPages, getWebstore } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [webstoreResult, categoriesResult, packagesResult, pagesResult] = await Promise.all([
    getWebstore(),
    getCategories(),
    getAllPackages(),
    getCustomPages(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard" }]}
        title="Dashboard"
        description="An overview of your Tebex webstore."
      />

      {!webstoreResult.ok ? (
        <ErrorPanel error={webstoreResult.error} audience="admin" />
      ) : (
        <>
          <SectionCard
            title={webstoreResult.data.data?.name}
            description={webstoreResult.data.data?.webstore_url}
            actions={
              <>
                <Badge variant={webstoreResult.data.data?.disabled ? "outline" : "default"}>
                  {webstoreResult.data.data?.disabled ? "Disabled" : "Active"}
                </Badge>
                <Badge variant="outline">{webstoreResult.data.data?.platform_type}</Badge>
                {webstoreResult.data.data?.currency && (
                  <Badge variant="outline">{webstoreResult.data.data.currency}</Badge>
                )}
              </>
            }
          >
            <Link
              href="/admin/webstore"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View full details <ExternalLink className="size-3.5" />
            </Link>
          </SectionCard>

          <StatGrid>
            <MetricCard
              label="Categories"
              value={categoriesResult.ok ? categoriesResult.data.data?.length ?? 0 : "—"}
              icon={Boxes}
            />
            <MetricCard
              label="Packages"
              value={packagesResult.ok ? packagesResult.data.data?.length ?? 0 : "—"}
              icon={Package}
            />
            <MetricCard
              label="Pages"
              value={pagesResult.ok ? pagesResult.data.data?.length ?? 0 : "—"}
              icon={FileText}
            />
          </StatGrid>
        </>
      )}
    </div>
  );
}
