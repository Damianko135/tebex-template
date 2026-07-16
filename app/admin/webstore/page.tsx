import { ErrorPanel } from "@/components/admin/error-panel";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PageHeader } from "@/components/admin/page-header";
import { PropertyGrid } from "@/components/admin/property-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWebstore } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function WebstorePage() {
  const result = await getWebstore();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Webstore" }]}
        title="Webstore"
        description="Information about your store as returned by the Headless API's root endpoint."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Store details</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGrid value={result.data.data ?? {}} columns={3} />
            </CardContent>
          </Card>
          <JSONViewer data={result.data} label="Raw response" />
        </>
      )}
    </div>
  );
}
