import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared wrapper for every storefront page that isn't the multi-section
 * homepage (which uses its own section-by-section rhythm via `space-y-24`).
 * Categories, search, category detail, and package detail all rendered this
 * exact class string independently before this was extracted. */
export function StorePage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6", className)}>{children}</div>;
}
