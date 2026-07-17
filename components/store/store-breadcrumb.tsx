import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface StoreCrumb {
  label: string;
  href?: string;
}

/** The category/package/basket-detail breadcrumb trail, previously
 * hand-rolled with matching but independently-maintained markup in each
 * page. Reuses the same `Breadcrumb` primitives admin's `PageHeader` is
 * built on, styled to match the storefront's plain-text trail (no visible
 * list markers, tighter gap than the primitive's default). */
export function StoreBreadcrumb({ crumbs, className }: { crumbs: StoreCrumb[]; className?: string }) {
  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList className="flex-nowrap gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => (
          <span key={`${index}-${crumb.label}`} className="contents">
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink render={<Link href={crumb.href}>{crumb.label}</Link>} />
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
