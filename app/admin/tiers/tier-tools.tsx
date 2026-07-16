"use client";

import { useActionState } from "react";

import { ActionFeedback } from "@/components/action-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PropertyGrid } from "@/components/admin/property-grid";
import { initialActionState } from "@/lib/action-state";

import { lookupTieredCategoriesAction, updateTierAction } from "./actions";

function Feedback({ state }: { state: { status: "idle" | "success" | "error"; message?: string } }) {
  return <ActionFeedback state={state} className="mb-3" successTitle="Done" errorTitle="Failed" />;
}

function BasicAuthFields() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="auth_username">Basic auth username</Label>
        <Input id="auth_username" name="auth_username" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="auth_password">Basic auth password</Label>
        <Input id="auth_password" name="auth_password" type="password" required />
      </div>
    </div>
  );
}

export function LookupTieredCategoriesForm() {
  const [state, action, isPending] = useActionState(lookupTieredCategoriesAction, initialActionState);
  const categories = state.status === "success" ? (state.data as Record<string, unknown>[]) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find a customer&apos;s tiers</CardTitle>
        <CardDescription>
          There&apos;s no endpoint to list tiers directly - this looks up a customer&apos;s tiered
          categories, which include their currently active tier (and its ID) if subscribed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <Feedback state={state} />
          <div className="space-y-1.5">
            <Label htmlFor="usernameId">Username ID</Label>
            <Input id="usernameId" name="usernameId" placeholder="76561198042467022" required />
          </div>
          <BasicAuthFields />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Looking up..." : "Find tiered categories"}
          </Button>
        </form>

        {categories.length > 0 && (
          <div className="mt-6 space-y-4">
            <Separator />
            {categories.map((category) => (
              <div key={String(category.id)} className="rounded-md border border-border p-3">
                <PropertyGrid value={category} exclude={["packages", "description"]} columns={2} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function UpdateTierForm() {
  const [state, action, isPending] = useActionState(updateTierAction, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update a tier</CardTitle>
        <CardDescription>
          Upgrades or downgrades a subscription tier to a new package via{" "}
          <code className="font-mono">PATCH /tiers/{"{tierId}"}</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <Feedback state={state} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tierId">Tier ID</Label>
              <Input id="tierId" name="tierId" placeholder="40796" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="package_id">New package ID</Label>
              <Input id="package_id" name="package_id" placeholder="6834822" required />
            </div>
          </div>
          <BasicAuthFields />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update tier"}
          </Button>
          {state.status === "success" && state.data !== undefined && (
            <JSONViewer data={state.data} label="Response" defaultOpen />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
