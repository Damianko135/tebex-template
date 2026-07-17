"use client";

import { useActionState, useEffect, useRef } from "react";

import { ActionFeedback } from "@/components/action-feedback";
import { SectionCard } from "@/components/admin/section-card";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { initialActionState } from "@/lib/action-state";
import { getRecentItems, pushRecentItem } from "@/lib/local-history";
import { createBasketAction, lookupBasketAction } from "./actions";

const RECENT_BASKETS_KEY = "admin.recentBaskets";

export function CreateBasketForm() {
  const [state, action, isPending] = useActionState(createBasketAction, initialActionState);

  return (
    <SectionCard
      title="Create a basket"
      description={
        <>
          Starts a new checkout basket via <code className="font-mono">POST /baskets</code>.
        </>
      }
    >
      <form action={action} className="space-y-4">
        <ActionFeedback state={state} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Complete URL" htmlFor="complete_url">
            <Input id="complete_url" name="complete_url" placeholder="https://example.tebex.io/thank-you" />
          </FormField>
          <FormField label="Cancel URL" htmlFor="cancel_url">
            <Input id="cancel_url" name="cancel_url" placeholder="https://example.tebex.io/" />
          </FormField>
        </div>
        <FormField label="Custom data (JSON)" htmlFor="custom">
          <Textarea id="custom" name="custom" placeholder='{"foo": "bar"}' rows={3} />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="complete_auto_redirect" className="size-4" />
          Auto-redirect on completion
        </label>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create basket"}
        </Button>
      </form>
    </SectionCard>
  );
}

export function LookupBasketForm() {
  const [state, action, isPending] = useActionState(lookupBasketAction, initialActionState);
  const identRef = useRef<HTMLInputElement>(null);
  const datalistRef = useRef<HTMLDataListElement>(null);

  // Populated imperatively (not via React state) so this never has to
  // reconcile against a server-rendered value that couldn't have known
  // about localStorage - there's nothing to hydrate-mismatch against.
  useEffect(() => {
    const recent = getRecentItems(RECENT_BASKETS_KEY);
    datalistRef.current?.replaceChildren(
      ...recent.map((ident) => {
        const option = document.createElement("option");
        option.value = ident;
        return option;
      })
    );
  }, []);

  function handleSubmit() {
    const value = identRef.current?.value.trim();
    if (value) pushRecentItem(RECENT_BASKETS_KEY, value);
  }

  return (
    <SectionCard
      title="Look up a basket"
      description={
        <>
          Open an existing basket by its identifier via{" "}
          <code className="font-mono">GET /baskets/{"{basketIdent}"}</code>.
        </>
      }
    >
      <form action={action} onSubmit={handleSubmit} className="space-y-4">
        <ActionFeedback state={state} />
        <FormField label="Basket identifier" htmlFor="basketIdent">
          <Input
            id="basketIdent"
            name="basketIdent"
            ref={identRef}
            list="recent-baskets"
            placeholder="1a-55fff4107740a1f40d844ff89607557f45bfafb3"
            className="font-mono"
          />
          <datalist id="recent-baskets" ref={datalistRef} />
        </FormField>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Looking up..." : "Open basket"}
        </Button>
      </form>
    </SectionCard>
  );
}
