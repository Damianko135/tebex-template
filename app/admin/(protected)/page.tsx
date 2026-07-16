import Link from "next/link";
import { Boxes, ExternalLink, FileText, Package, Store } from "lucide-react";

import { MetricCard, StatGrid } from "@/components/admin/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorPanel } from "@/components/error-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPackages, getCategories, getCustomPages, getWebstore } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  { href: "/admin/webstore", label: "Webstore settings", icon: Store },
  { href: "/admin/categories", label: "Browse categories", icon: Boxes },
  { href: "/admin/packages", label: "Browse packages", icon: Package },
  { href: "/admin/pages", label: "View CMS pages", icon: FileText },
];

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
        description="An overview of your Tebex webstore, powered live by the Headless API."
      />

      {!webstoreResult.ok ? (
        <ErrorPanel error={webstoreResult.error} />
      ) : (
        <>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{webstoreResult.data.data?.name}</CardTitle>
                <CardDescription>
                  {webstoreResult.data.data?.webstore_url}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={webstoreResult.data.data?.disabled ? "outline" : "default"}>
                  {webstoreResult.data.data?.disabled ? "Disabled" : "Active"}
                </Badge>
                <Badge variant="outline">{webstoreResult.data.data?.platform_type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin/webstore"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View full details <ExternalLink className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

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
              label="CMS pages"
              value={pagesResult.ok ? pagesResult.data.data?.length ?? 0 : "—"}
              icon={FileText}
            />
            <MetricCard
              label="Currency"
              value={webstoreResult.data.data?.currency ?? "—"}
              icon={Store}
            />
          </StatGrid>
        </>
      )}

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Quick links</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <link.icon className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
