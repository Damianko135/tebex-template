"use client";

import { useActionState, useEffect, useRef } from "react";

import { ActionFeedback } from "@/components/action-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PropertyGrid } from "@/components/admin/property-grid";
import { SectionCard } from "@/components/admin/section-card";
import { FormField } from "@/components/form-field";
import { initialActionState } from "@/lib/action-state";

import { lookupTieredCategoriesAction, updateTierAction } from "./actions";

const AUTH_USERNAME_KEY = "admin.basicAuthUsername";

function Feedback({ state }: { state: { status: "idle" | "success" | "error"; message?: string } }) {
  return <ActionFeedback state={state} className="mb-3" successTitle="Done" errorTitle="Failed" />;
}

// Basic Auth is re-entered on every tier lookup/update since these are
// scoped, short-lived credentials, not a persisted admin session - but
// re-typing the username (never the password) on every single action is
// pure friction. Prefilled imperatively via a ref, not React state, so
// there's nothing to hydrate-mismatch against.
function BasicAuthFields() {
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_USERNAME_KEY);
    if (stored && usernameRef.current) usernameRef.current.value = stored;
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <FormField label="Basic auth username" htmlFor="auth_username">
        <Input
          id="auth_username"
          name="auth_username"
          ref={usernameRef}
          onChange={(event) => window.localStorage.setItem(AUTH_USERNAME_KEY, event.target.value)}
          required
        />
      </FormField>
      <FormField label="Basic auth password" htmlFor="auth_password">
        <Input id="auth_password" name="auth_password" type="password" required />
      </FormField>
    </div>
  );
}

export function LookupTieredCategoriesForm() {
  const [state, action, isPending] = useActionState(lookupTieredCategoriesAction, initialActionState);
  const categories = state.status === "success" ? (state.data as Record<string, unknown>[]) : [];

  return (
    <SectionCard
      title="Find a customer's tiers"
      description={
        <>
          There&apos;s no endpoint to list tiers directly - this looks up a customer&apos;s tiered
          categories, which include their currently active tier (and its ID) if subscribed.
        </>
      }
    >
      <form action={action} className="space-y-4">
        <Feedback state={state} />
        <FormField label="Username ID" htmlFor="usernameId">
          <Input id="usernameId" name="usernameId" placeholder="76561198042467022" required />
        </FormField>
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
    </SectionCard>
  );
}

export function UpdateTierForm() {
  const [state, action, isPending] = useActionState(updateTierAction, initialActionState);

  return (
    <SectionCard
      title="Update a tier"
      description={
        <>
          Upgrades or downgrades a subscription tier to a new package via{" "}
          <code className="font-mono">PATCH /tiers/{"{tierId}"}</code>.
        </>
      }
    >
      <form action={action} className="space-y-4">
        <Feedback state={state} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Tier ID" htmlFor="tierId">
            <Input id="tierId" name="tierId" placeholder="40796" required />
          </FormField>
          <FormField label="New package ID" htmlFor="package_id">
            <Input id="package_id" name="package_id" placeholder="6834822" required />
          </FormField>
        </div>
        <BasicAuthFields />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update tier"}
        </Button>
        {state.status === "success" && state.data !== undefined && (
          <JSONViewer data={state.data} label="Response" defaultOpen />
        )}
      </form>
    </SectionCard>
  );
}
