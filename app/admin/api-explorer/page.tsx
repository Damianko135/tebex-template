import { API_INFO, ENDPOINT_MANIFEST } from "tebex-headless";

import { ApiExplorer } from "@/components/admin/api-explorer";
import { PageHeader } from "@/components/admin/page-header";

export default function ApiExplorerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "API explorer" }]}
        title="API explorer"
        description={`Every operation in ${API_INFO.title} v${API_INFO.version}, generated directly from the OpenAPI schema.`}
      />
      <ApiExplorer endpoints={ENDPOINT_MANIFEST} />
    </div>
  );
}
