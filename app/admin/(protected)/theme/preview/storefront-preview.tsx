"use client";

import { BellRing } from "lucide-react";

import { CategoryCard } from "@/components/store/category-card";
import { PackageCard } from "@/components/store/package-card";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  PREVIEW_CATEGORIES,
  PREVIEW_PACKAGES,
  PREVIEW_PAGES,
  PREVIEW_STORE_NAME,
} from "./fixtures";
import { StaticPreviewSurface } from "./static-preview-surface";

export function StorefrontPreview() {
  return (
    <Card className="overflow-hidden p-0">
      <StaticPreviewSurface>
        <div className="rounded-lg border border-border bg-background">
          <SiteHeader
            storeName={PREVIEW_STORE_NAME}
            categories={PREVIEW_CATEGORIES}
            pages={PREVIEW_PAGES}
            cartCount={2}
          />

          <div className="space-y-4 p-4 sm:p-5">
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Live sale</Badge>
                <Badge variant="secondary">Seasonal bundles</Badge>
              </div>
              <h3 className="font-heading text-lg tracking-tight">Summer collection is now live</h3>
              <p className="text-sm text-muted-foreground">
                This section mirrors the actual storefront voice and call-to-action patterns.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button">Browse packages</Button>
                <Button type="button" variant="outline">View categories</Button>
                <Button type="button" variant="secondary">Gift cards</Button>
              </div>
            </div>

            <Alert>
              <BellRing className="size-4" />
              <AlertTitle>Announcement</AlertTitle>
              <AlertDescription>
                Maintenance starts in 2 hours. Purchases remain available during the event.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PREVIEW_CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4">
              {PREVIEW_PACKAGES.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm">Token behavior checks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                    Accent
                  </span>
                  <span className="rounded-md bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                    Destructive
                  </span>
                  <span className="rounded-md bg-success px-2 py-1 text-xs font-medium text-success-foreground">
                    Success
                  </span>
                  <span className="rounded-md bg-warning px-2 py-1 text-xs font-medium text-warning-foreground">
                    Warning
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full ring-2 ring-ring" />
                    Ring
                  </span>
                </div>
                <Popover open>
                  <PopoverTrigger
                    type="button"
                    className="rounded-md border border-input bg-background px-2 py-1.5 text-xs"
                  >
                    Open popover token sample
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <PopoverHeader>
                      <PopoverTitle>Popover surface</PopoverTitle>
                      <PopoverDescription>
                        Uses popover and popover-foreground directly from the scoped theme.
                      </PopoverDescription>
                    </PopoverHeader>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>

          <SiteFooter storeName={PREVIEW_STORE_NAME} currency="USD" pages={PREVIEW_PAGES} />
        </div>
      </StaticPreviewSurface>
    </Card>
  );
}
