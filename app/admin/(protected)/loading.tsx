import { Skeleton } from "@/components/ui/skeleton";

// AdminShell's sidebar/header chrome lives in this segment's layout.tsx, so
// it stays mounted while this fills the content area during a page's data
// fetch (every admin page is force-dynamic and hits the Tebex API live).
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-7 w-56" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
