"use client";

import type { CSSProperties } from "react";
import { useActionState, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ColorPicker, ColorService, type IColor } from "react-color-palette";
import "react-color-palette/css";

import { ActionFeedback } from "@/components/action-feedback";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Theme, ThemeColors } from "@/lib/ui/tokens";
import { initialActionState } from "@/lib/action-state";

import { resetThemeAction, updateThemeAction } from "./actions";
import { THEME_TOKEN_FIELDS, THEME_TOKEN_GROUPS, type ThemeTokenField } from "./theme-fields";

const THEME_FORM_ID = "theme-form";

// react-color-palette's ColorService always touches `document` (canvas-based
// color parsing), so it can't run during the server render pass. Seed with a
// neutral placeholder and resolve the real color client-side after mount.
const PLACEHOLDER_COLOR: IColor = {
  hex: "#000000",
  rgb: { r: 0, g: 0, b: 0, a: 1 },
  hsv: { h: 0, s: 0, v: 0, a: 1 },
};

function ColorField({
  mode,
  field,
  value,
  onChange,
}: {
  mode: "light" | "dark";
  field: ThemeTokenField;
  value: string;
  onChange: (value: string) => void;
}) {
  const name = `${mode}.${field.key}`;
  // Pure derived value, computed fresh each render - not state. The
  // SSR guard is needed because ColorService.convert touches `document`
  // unconditionally; the result only ever feeds the popover's ColorPicker,
  // which isn't mounted until opened, so there's nothing to hydrate-mismatch.
  const color =
    typeof document === "undefined"
      ? PLACEHOLDER_COLOR
      : ColorService.convert("hex", value);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger
          type="button"
          aria-label={`Pick a color for ${field.label}`}
          className="size-8 shrink-0 rounded-md border border-border outline-none transition-shadow hover:ring-2 hover:ring-ring/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          style={{ background: value }}
        />
        <PopoverContent className="w-auto p-3">
          <ColorPicker
            height={140}
            color={color}
            onChange={(next) => onChange(next.hex)}
          />
        </PopoverContent>
      </Popover>
      <div className="flex-1 space-y-1">
        <Label htmlFor={name}>{field.label}</Label>
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// "Core" is open by default since it's the group nearly every store owner
// touches (background, primary, accent, etc.); "Sidebar" and "Charts" are
// specialist token sets most stores never customize, so they start
// collapsed to keep the common case scannable instead of a 33-field wall.
function ColorGroup({
  group,
  mode,
  colors,
  onColorChange,
  defaultOpen = false,
}: {
  group: (typeof THEME_TOKEN_GROUPS)[number];
  mode: "light" | "dark";
  colors: ThemeColors;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const fields = THEME_TOKEN_FIELDS.filter((field) => field.group === group);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="-m-1 flex w-full items-center gap-1.5 rounded-sm p-1 text-xs font-medium tracking-wide text-muted-foreground uppercase outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
        <ChevronRight className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-90")} />
        {group}
        <span className="ml-auto font-normal normal-case text-muted-foreground/70">
          {fields.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-1 gap-3 pt-3">
          {fields.map((field) => (
            <ColorField
              key={field.key}
              mode={mode}
              field={field}
              value={colors[field.key]}
              onChange={(value) => onColorChange(field.key, value)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ModeTab({
  mode,
  colors,
  onColorChange,
  className,
}: {
  mode: "light" | "dark";
  colors: ThemeColors;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 pt-4", className)}>
      {THEME_TOKEN_GROUPS.map((group, index) => (
        <div key={group} className="space-y-4">
          {index > 0 && <Separator />}
          <ColorGroup
            group={group}
            mode={mode}
            colors={colors}
            onColorChange={onColorChange}
            defaultOpen={group === "Core"}
          />
        </div>
      ))}
    </div>
  );
}

const PREVIEW_PRODUCTS = ["Jacket", "Sneakers", "Backpack"];
const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const;

// Scopes the draft's CSS custom properties on this wrapper via inline style,
// the same technique shadcn/ui and shadcn-svelte use for their own theme
// customizers - everything inside reads var(--primary) etc. through the
// normal cascade, so no separate document or cross-frame sync is needed.
function ThemePreview({
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
        "flex h-full flex-col gap-6 overflow-auto rounded-xl border border-border bg-background p-6 text-foreground",
        mode === "dark" && "dark"
      )}
      style={style}
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <span className="text-lg font-semibold">Your Store</span>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Shop</span>
          <span>About</span>
          <Badge>Cart - 2</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          New arrivals
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Browse the latest packages added to the store.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button">Shop now</Button>
          <Button type="button" variant="outline">
            Learn more
          </Button>
          <Button type="button" variant="ghost">
            Wishlist
          </Button>
        </div>
      </div>

      <Alert>
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>
          This alert style is used for callouts and announcements.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PREVIEW_PRODUCTS.map((name) => (
          <Card key={name} size="sm">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>$59.00</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" size="sm" className="w-full">
                Add to cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 rounded-lg bg-sidebar p-3 text-sidebar-foreground">
        <span className="text-xs font-medium tracking-wide text-sidebar-foreground/70 uppercase">
          Sidebar
        </span>
        <span className="rounded-md bg-sidebar-primary px-2 py-1 text-xs text-sidebar-primary-foreground">
          Primary
        </span>
        <span className="rounded-md bg-sidebar-accent px-2 py-1 text-xs text-sidebar-accent-foreground">
          Accent
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="text-xs font-medium tracking-wide text-sidebar-foreground/70 uppercase">
            Charts
          </span>
          {CHART_KEYS.map((key) => (
            <span
              key={key}
              className="size-4 rounded-full"
              style={{ background: `var(--${key})` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export function ThemeForm({
  theme,
  storageBackend,
}: {
  theme: Theme;
  storageBackend: "redis" | "memory";
}) {
  const [saveState, saveAction, isSaving] = useActionState(
    updateThemeAction,
    initialActionState
  );
  const [resetState, resetAction, isResetting] = useActionState(
    resetThemeAction,
    initialActionState
  );

  const [draft, setDraft] = useState<Theme>(theme);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");

  const feedback = resetState.status !== "idle" ? resetState : saveState;

  function handleColorChange(mode: "light" | "dark", key: keyof ThemeColors, value: string) {
    setDraft((prev) => ({ ...prev, [mode]: { ...prev[mode], [key]: value } }));
  }

  function handleCopyLightToDark() {
    setDraft((prev) => ({ ...prev, dark: { ...prev.light } }));
  }

  return (
    <div className="flex h-176 gap-4">
      <aside className="flex w-80 shrink-0 flex-col rounded-lg border border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold leading-tight">Storefront theme</p>
            <p className="text-xs text-muted-foreground">Edit colors</p>
          </div>
          <Badge variant={storageBackend === "redis" ? "default" : "outline"}>
            {storageBackend === "redis" ? "Redis" : "In-memory (dev)"}
          </Badge>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
          <form id={THEME_FORM_ID} action={saveAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="radius">Corner radius</Label>
              <Input
                id="radius"
                name="radius"
                value={draft.radius}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, radius: event.target.value }))
                }
              />
            </div>

            <Separator />

            <Tabs
              value={activeMode}
              onValueChange={(value) => setActiveMode(value as "light" | "dark")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="light" className="flex-1">
                  Light
                </TabsTrigger>
                <TabsTrigger value="dark" className="flex-1">
                  Dark
                </TabsTrigger>
              </TabsList>
              <TabsContent value="light">
                <ModeTab
                  mode="light"
                  colors={draft.light}
                  onColorChange={(key, value) => handleColorChange("light", key, value)}
                />
              </TabsContent>
              <TabsContent value="dark">
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" size="xs" onClick={handleCopyLightToDark}>
                    Copy from light theme
                  </Button>
                </div>
                <ModeTab
                  mode="dark"
                  colors={draft.dark}
                  onColorChange={(key, value) => handleColorChange("dark", key, value)}
                  className="pt-3"
                />
              </TabsContent>
            </Tabs>
          </form>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
          <form action={resetAction}>
            <Button type="submit" variant="outline" size="sm" disabled={isResetting}>
              {isResetting ? "Resetting..." : "Reset"}
            </Button>
          </form>
          <Button type="submit" form={THEME_FORM_ID} size="sm" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save theme"}
          </Button>
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <ActionFeedback state={feedback} successTitle="Saved" />
        <div className="min-h-0 flex-1">
          <ThemePreview mode={activeMode} radius={draft.radius} colors={draft[activeMode]} />
        </div>
      </div>
    </div>
  );
}
