import { PackageBrowser } from "@/components/store/package-browser";
import { EmptyState } from "@/components/empty-state";
import { getAllPackages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const result = await getAllPackages();
  const packages = result.ok ? (result.data.data ?? []) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">All packages</h1>
        <p className="text-muted-foreground">Everything available in the store, in one place.</p>
      </div>

      {packages.length === 0 ? (
        <EmptyState title="No packages available" description="Check back soon." />
      ) : (
        <PackageBrowser packages={packages} />
      )}
    </div>
  );
}
