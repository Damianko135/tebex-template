"use client";

import { useActionState } from "react";

import { ActionFeedback } from "@/components/action-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { initialActionState } from "@/lib/action-state";
import { createBasketAction, lookupBasketAction } from "./actions";

export function CreateBasketForm() {
  const [state, action, isPending] = useActionState(createBasketAction, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a basket</CardTitle>
        <CardDescription>
          Starts a new checkout basket via <code className="font-mono">POST /baskets</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <ActionFeedback state={state} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="complete_url">Complete URL</Label>
              <Input id="complete_url" name="complete_url" placeholder="https://example.tebex.io/thank-you" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cancel_url">Cancel URL</Label>
              <Input id="cancel_url" name="cancel_url" placeholder="https://example.tebex.io/" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="custom">Custom data (JSON)</Label>
            <Textarea id="custom" name="custom" placeholder='{"foo": "bar"}' rows={3} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="complete_auto_redirect" className="size-4" />
            Auto-redirect on completion
          </label>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create basket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function LookupBasketForm() {
  const [state, action, isPending] = useActionState(lookupBasketAction, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Look up a basket</CardTitle>
        <CardDescription>
          Open an existing basket by its identifier via{" "}
          <code className="font-mono">GET /baskets/{"{basketIdent}"}</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <ActionFeedback state={state} />
          <div className="space-y-1.5">
            <Label htmlFor="basketIdent">Basket identifier</Label>
            <Input
              id="basketIdent"
              name="basketIdent"
              placeholder="1a-55fff4107740a1f40d844ff89607557f45bfafb3"
              className="font-mono"
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Looking up..." : "Open basket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
