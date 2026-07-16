"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ColorPicker, ColorService, type IColor } from "react-color-palette";
import "react-color-palette/css";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { themeVarsToCSSText } from "@/lib/ui/theme-css";
import type { Theme, ThemeColors } from "@/lib/ui/tokens";

import { resetThemeAction, updateThemeAction } from "./actions";
import { THEME_TOKEN_FIELDS, THEME_TOKEN_GROUPS, type ThemeTokenField } from "./theme-fields";
import { initialThemeFormState } from "./theme-form-state";

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
          className="size-8 shrink-0 rounded-md border border-border"
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

function ColorGroup({
  group,
  mode,
  colors,
  onColorChange,
}: {
  group: (typeof THEME_TOKEN_GROUPS)[number];
  mode: "light" | "dark";
  colors: ThemeColors;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
}) {
  const fields = THEME_TOKEN_FIELDS.filter((field) => field.group === group);
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {group}
      </h3>
      <div className="grid grid-cols-1 gap-3">
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
    </div>
  );
}

function ModeTab({
  mode,
  colors,
  onColorChange,
}: {
  mode: "light" | "dark";
  colors: ThemeColors;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
}) {
  return (
    <div className="space-y-6 pt-4">
      {THEME_TOKEN_GROUPS.map((group, index) => (
        <div key={group} className="space-y-6">
          {index > 0 && <Separator />}
          <ColorGroup
            group={group}
            mode={mode}
            colors={colors}
            onColorChange={onColorChange}
          />
        </div>
      ))}
    </div>
  );
}

const LIVE_PREVIEW_STYLE_ID = "live-theme-preview";

function LivePreviewFrame({ theme, mode }: { theme: Theme; mode: "light" | "dark" }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  // The browser starts loading the iframe's `src` as soon as it parses the
  // server-rendered HTML - often before React hydrates and attaches an
  // `onLoad` handler, so that event can fire before anyone is listening.
  // Check readiness directly on mount, and still listen for `load` as a
  // fallback for slower loads that genuinely happen after mount.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function checkReady() {
      if (iframe?.contentDocument && iframe.contentDocument.readyState !== "loading") {
        setReady(true);
      }
    }

    checkReady();
    iframe.addEventListener("load", checkReady);
    return () => iframe.removeEventListener("load", checkReady);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.documentElement.classList.toggle("dark", mode === "dark");

    let style = doc.getElementById(LIVE_PREVIEW_STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = LIVE_PREVIEW_STYLE_ID;
      doc.head.appendChild(style);
    }
    style.textContent = `:root {\n${themeVarsToCSSText({
      ...theme[mode],
      radius: theme.radius,
    })}\n}`;
  }, [ready, theme, mode]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Live preview - the actual storefront
        </span>
        <Badge variant="secondary">{mode}</Badge>
      </div>
      <iframe
        ref={iframeRef}
        src="/"
        title="Storefront live preview"
        className="w-full flex-1 bg-background"
      />
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
    initialThemeFormState
  );
  const [resetState, resetAction, isResetting] = useActionState(
    resetThemeAction,
    initialThemeFormState
  );

  const [draft, setDraft] = useState<Theme>(theme);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");

  const feedback = resetState.status !== "idle" ? resetState : saveState;

  function handleColorChange(mode: "light" | "dark", key: keyof ThemeColors, value: string) {
    setDraft((prev) => ({ ...prev, [mode]: { ...prev[mode], [key]: value } }));
  }

  return (
    <SidebarProvider className="min-h-svh">
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-1 py-1">
            <div>
              <p className="text-sm font-semibold leading-tight">Storefront theme</p>
              <p className="text-xs text-muted-foreground">Edit colors</p>
            </div>
            <Badge variant={storageBackend === "redis" ? "default" : "outline"}>
              {storageBackend === "redis" ? "Redis" : "In-memory (dev)"}
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <form id={THEME_FORM_ID} action={saveAction}>
            <SidebarGroup className="space-y-4">
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
                  <ModeTab
                    mode="dark"
                    colors={draft.dark}
                    onColorChange={(key, value) => handleColorChange("dark", key, value)}
                  />
                </TabsContent>
              </Tabs>
            </SidebarGroup>
          </form>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center justify-between gap-2">
            <form action={resetAction}>
              <Button type="submit" variant="outline" size="sm" disabled={isResetting}>
                {isResetting ? "Resetting..." : "Reset"}
              </Button>
            </form>
            <Button type="submit" form={THEME_FORM_ID} size="sm" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save theme"}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="h-svh">
        <header className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold">Storefront theme</h1>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3">
          {feedback.status !== "idle" && (
            <Alert variant={feedback.status === "error" ? "destructive" : "default"}>
              <AlertTitle>
                {feedback.status === "error" ? "Something went wrong" : "Saved"}
              </AlertTitle>
              {feedback.message && (
                <AlertDescription>{feedback.message}</AlertDescription>
              )}
            </Alert>
          )}
          <div className="min-h-0 flex-1">
            <LivePreviewFrame theme={draft} mode={activeMode} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
