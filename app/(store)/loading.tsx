import { Skeleton } from "@/components/ui/skeleton";

// Shown while any app/(store) route's server-fetched data (Tebex API calls,
// all declared force-dynamic) is still loading. StorefrontShell's header/
// footer are a separate layout, so only the page content area needs a
// placeholder here.
export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
