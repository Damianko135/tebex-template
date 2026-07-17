import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** The titled-card-section shape repeated across nearly every admin detail
 * page and settings form (Properties, Media, Coupons, Store details, ...).
 * `CardTitle`/`CardDescription` are rendered as direct `CardHeader` children
 * when there's no `actions` slot, matching `Card`'s own grid layout
 * (`has-data-[slot=card-description]:grid-rows-[auto_auto]`) instead of an
 * extra wrapper div; the `actions` variant needs that wrapper to make the
 * header a two-item flex row. */
export function SectionCard({
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  const titleAndDescription = (
    <>
      <CardTitle>{title}</CardTitle>
      {description !== undefined && <CardDescription>{description}</CardDescription>}
    </>
  );

  return (
    <Card className={className}>
      {actions ? (
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>{titleAndDescription}</div>
          <div className="flex items-center gap-2">{actions}</div>
        </CardHeader>
      ) : (
        <CardHeader>{titleAndDescription}</CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
