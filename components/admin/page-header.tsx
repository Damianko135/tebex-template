import type { ReactNode } from "react";
import NextLink from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  crumbs,
  title,
  description,
  actions,
}: {
  crumbs: Crumb[];
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <span key={crumb.label} className="contents">
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink render={<NextLink href={crumb.href}>{crumb.label}</NextLink>} />
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < crumbs.length - 1 && <BreadcrumbSeparator />}
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-heading text-xl tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
