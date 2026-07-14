"use client";

import { useActionState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Theme } from "@/lib/ui/tokens";

import { initialThemeFormState, resetThemeAction, updateThemeAction } from "./actions";
import { THEME_TOKEN_FIELDS, THEME_TOKEN_GROUPS, type ThemeTokenField } from "./theme-fields";

const THEME_FORM_ID = "theme-form";

function ColorField({
  mode,
  field,
  defaultValue,
}: {
  mode: "light" | "dark";
  field: ThemeTokenField;
  defaultValue: string;
}) {
  const name = `${mode}.${field.key}`;
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="size-8 shrink-0 rounded-md border border-border"
        style={{ background: defaultValue }}
      />
      <div className="flex-1 space-y-1">
        <Label htmlFor={name}>{field.label}</Label>
        <Input id={name} name={name} defaultValue={defaultValue} spellCheck={false} />
      </div>
    </div>
  );
}

function ColorGroup({
  group,
  mode,
  theme,
}: {
  group: (typeof THEME_TOKEN_GROUPS)[number];
  mode: "light" | "dark";
  theme: Theme;
}) {
  const fields = THEME_TOKEN_FIELDS.filter((field) => field.group === group);
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {group}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <ColorField
            key={field.key}
            mode={mode}
            field={field}
            defaultValue={theme[mode][field.key]}
          />
        ))}
      </div>
    </div>
  );
}

function ModeTab({ mode, theme }: { mode: "light" | "dark"; theme: Theme }) {
  return (
    <div className="space-y-6 pt-4">
      {THEME_TOKEN_GROUPS.map((group, index) => (
        <div key={group} className="space-y-6">
          {index > 0 && <Separator />}
          <ColorGroup group={group} mode={mode} theme={theme} />
        </div>
      ))}
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

  const feedback = resetState.status !== "idle" ? resetState : saveState;

  return (
    <Card>
      <form id={THEME_FORM_ID} action={saveAction}>
        <CardHeader>
          <CardTitle>Storefront theme</CardTitle>
          <CardDescription>
            These colors apply to every visitor of the storefront. Changes save to
            the shared key-value store and take effect immediately for new page
            loads.
          </CardDescription>
          <CardAction>
            <Badge variant={storageBackend === "redis" ? "default" : "outline"}>
              {storageBackend === "redis" ? "Redis" : "In-memory (dev)"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="max-w-xs space-y-1">
            <Label htmlFor="radius">Corner radius</Label>
            <Input id="radius" name="radius" defaultValue={theme.radius} />
          </div>

          <Separator />

          <Tabs defaultValue="light">
            <TabsList>
              <TabsTrigger value="light">Light mode</TabsTrigger>
              <TabsTrigger value="dark">Dark mode</TabsTrigger>
            </TabsList>
            <TabsContent value="light">
              <ModeTab mode="light" theme={theme} />
            </TabsContent>
            <TabsContent value="dark">
              <ModeTab mode="dark" theme={theme} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </form>
      <CardFooter className="justify-between">
        <form action={resetAction}>
          <Button type="submit" variant="outline" disabled={isResetting}>
            {isResetting ? "Resetting..." : "Reset to defaults"}
          </Button>
        </form>
        <Button type="submit" form={THEME_FORM_ID} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save theme"}
        </Button>
      </CardFooter>
    </Card>
  );
}
