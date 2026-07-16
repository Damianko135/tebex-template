import { PageHeader } from "@/components/admin/page-header";

import { CreateBasketForm, LookupBasketForm } from "./basket-forms";

export default function BasketsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Baskets" }]}
        title="Basket explorer"
        description="The Headless API has no endpoint to list baskets, so create a new one or open an existing one by identifier to inspect and manage it."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CreateBasketForm />
        <LookupBasketForm />
      </div>
    </div>
  );
}
