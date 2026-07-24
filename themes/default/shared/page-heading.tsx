import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The title + description block repeated at the top of every top-level
 * storefront listing page (categories, packages, search). */
export function PageHeading({
  title,
  description,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 space-y-1", className)}>
      <h1 className="font-heading text-3xl tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
