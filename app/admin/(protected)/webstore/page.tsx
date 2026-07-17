import { ErrorPanel } from "@/components/error-panel";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PageHeader } from "@/components/admin/page-header";
import { PropertyGrid } from "@/components/admin/property-grid";
import { SectionCard } from "@/components/admin/section-card";
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
        <ErrorPanel error={result.error} audience="admin" />
      ) : (
        <>
          <SectionCard title="Store details">
            <PropertyGrid value={result.data.data ?? {}} columns={3} />
          </SectionCard>
          <JSONViewer data={result.data} label="Raw response" />
        </>
      )}
    </div>
  );
}
