import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import type { getAllPackages } from "@/lib/tebex/queries";
import { PageHeading, StorePage } from "@/themes/default/shared";

import { PackageBrowser } from "./package-browser";

type PackagesResult = Awaited<ReturnType<typeof getAllPackages>>;

/** The themed /packages listing page. Fetching lives in
 * app/(store)/packages/page.tsx; this component owns the error, empty, and
 * browsing states, since all three share the same heading/wrapper layout. */
export function PackagesPage({ result }: { result: PackagesResult }) {
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
