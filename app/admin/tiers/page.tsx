import { PageHeader } from "@/components/admin/page-header";

import { LookupTieredCategoriesForm, UpdateTierForm } from "./tier-tools";

export default function TiersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Tiers" }]}
        title="Subscription tiers"
        description="Tools for managing tiered-category subscriptions. Both operations require the store's basicAuth credentials for this API."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LookupTieredCategoriesForm />
        <UpdateTierForm />
      </div>
    </div>
  );
}
