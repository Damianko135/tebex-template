"use client";

import type { CSSProperties, ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ThemeColors } from "@/lib/ui/tokens";

import { AdminPreview } from "./admin-preview";
import { ReservedPreview } from "./reserved-preview";
import { StorefrontPreview } from "./storefront-preview";

function PreviewSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ThemePreview({
  mode,
  radius,
  colors,
}: {
  mode: "light" | "dark";
  radius: string;
  colors: ThemeColors;
}) {
  const style = {
    ...Object.fromEntries(Object.entries(colors).map(([key, value]) => [`--${key}`, value])),
    "--radius": radius,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "h-full space-y-4 overflow-auto rounded-xl border border-border bg-background p-4 text-foreground",
        mode === "dark" && "dark"
      )}
      style={style}
    >
      <PreviewSection
        title="Storefront preview"
        description="Real storefront components merchants and customers interact with."
      >
        <StorefrontPreview />
      </PreviewSection>

      <PreviewSection
        title="Admin preview"
        description="Administrative surfaces for managing catalog content and settings."
      >
        <AdminPreview />
      </PreviewSection>

      <ReservedPreview />
    </div>
  );
}
