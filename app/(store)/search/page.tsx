import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { getAllPackages } from "@/lib/tebex/queries";
import { PackageBrowser } from "@/themes/default/packages";
import { PageHeading, StorePage } from "@/themes/default/shared";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, result] = await Promise.all([searchParams, getAllPackages()]);

  return (
    <StorePage>
      <PageHeading
        title="Search"
        description={
          q ? (
            <>
              Results for <span className="font-medium text-foreground">&quot;{q}&quot;</span>
            </>
          ) : (
            "Search across every package in the store."
          )
        }
      />

      {!result.ok ? (
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href={q ? `/search?q=${encodeURIComponent(q)}` : "/search"} />}>
              Try again
            </Button>
          }
        />
      ) : (result.data.data ?? []).length === 0 ? (
        <EmptyState title="No packages available" description="Check back soon." />
      ) : (
        <PackageBrowser packages={result.data.data ?? []} initialQuery={q ?? ""} />
      )}
    </StorePage>
  );
}
