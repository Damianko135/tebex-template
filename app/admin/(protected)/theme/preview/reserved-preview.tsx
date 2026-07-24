"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { CHART_KEYS } from "./fixtures";

export function ReservedPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Reserved / future components</CardTitle>
        <CardDescription>
          Chart palette tokens are editable now but not yet used by shipping storefront or admin charts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {CHART_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-xs">
              <span className="size-3 rounded-full" style={{ background: `var(--${key})` }} />
              <span className="font-mono">{key}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Keep chart tokens here until a real chart component lands in storefront or admin.
        </p>
      </CardContent>
    </Card>
  );
}
