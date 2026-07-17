import { Boxes } from "lucide-react";

import { CategoryTable } from "@/components/admin/category-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { getCategoriesWithPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesListPage() {
  const result = await getCategoriesWithPackages();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Categories" }]}
        title="Categories"
        description="Storefront categories, including their packages."
      />

      {!result.ok ? (
        <ErrorPanel error={result.error} audience="admin" />
      ) : !result.data.data || result.data.data.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No categories"
          description="Create categories from the Tebex control panel under Webstore > Categories."
        />
      ) : (
        <CategoryTable categories={result.data.data} />
      )}
    </div>
  );
}
