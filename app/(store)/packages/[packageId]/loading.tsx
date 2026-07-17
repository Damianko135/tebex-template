import { Skeleton } from "@/components/ui/skeleton";

// Overrides app/(store)/loading.tsx's grid-shaped default with the package
// detail page's actual two-column layout - see impeccable critique.
export default function PackageDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-6 h-4 w-56" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-9 w-3/4" />
          </div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full max-w-56 rounded-md" />
          <div className="space-y-2 border-t border-border pt-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
