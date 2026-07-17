import { Skeleton } from "@/components/ui/skeleton";

// Next.js resolves the nearest loading.tsx to the route being fetched, so
// this overrides app/(store)/loading.tsx's grid-shaped skeleton with one
// that matches the basket page's actual list-plus-summary layout - the
// shared default caused a visible layout "pop" here (see impeccable critique).
export default function BasketLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Skeleton className="mb-10 h-9 w-40" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="divide-y divide-border rounded-lg border border-border">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="size-16 shrink-0 rounded-md" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-8 w-20 shrink-0 rounded-md" />
                <Skeleton className="h-4 w-14 shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-fit space-y-5 rounded-lg border border-border bg-card p-6 lg:col-span-1">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
