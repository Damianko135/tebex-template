import Link from "next/link";

import { PackageBrowser } from "@/components/store/package-browser";
import { PageHeading } from "@/components/store/page-heading";
import { StorePage } from "@/components/store/page-container";
import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { getAllPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const result = await getAllPackages();

  return (
    <StorePage>
      <PageHeading title="All packages" description="Everything available in the store, in one place." />

      {!result.ok ? (
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href="/packages" />}>
              Try again
            </Button>
          }
        />
      ) : (result.data.data ?? []).length === 0 ? (
        <EmptyState title="No packages available" description="Check back soon." />
      ) : (
        <PackageBrowser packages={result.data.data ?? []} />
      )}
    </StorePage>
  );
}
