"use client";

import { useActionState } from "react";
import { Plus, X } from "lucide-react";
import type { components } from "tebex-headless";

import { ActionFeedback } from "@/components/action-feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSONViewer } from "@/components/admin/json-viewer";

import { initialActionState } from "@/lib/action-state";
import {
  addPackageAction,
  applyCouponAction,
  applyCreatorCodeAction,
  applyGiftCardAction,
  getAuthUrlsAction,
  removeCouponAction,
  removeCreatorCodeAction,
  removeGiftCardAction,
} from "./actions";

type Coupon = components["schemas"]["Coupon"];
type GiftCard = components["schemas"]["GiftCard"];

function Feedback({ state }: { state: { status: "idle" | "success" | "error"; message?: string } }) {
  return <ActionFeedback state={state} className="mb-3" successTitle="Done" errorTitle="Failed" />;
}

function HiddenBasketIdent({ basketIdent }: { basketIdent: string }) {
  return <input type="hidden" name="basketIdent" value={basketIdent} />;
}

export function CouponPanel({ basketIdent, coupons }: { basketIdent: string; coupons: Coupon[] }) {
  const [applyState, applyAction, applying] = useActionState(applyCouponAction, initialActionState);
  const [removeState, removeAction, removing] = useActionState(removeCouponAction, initialActionState);
  const state = removeState.status !== "idle" ? removeState : applyState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Feedback state={state} />
        {coupons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {coupons.map((coupon) => (
              <form key={coupon.code} action={removeAction}>
                <HiddenBasketIdent basketIdent={basketIdent} />
                <input type="hidden" name="coupon_code" value={coupon.code} />
                <Badge variant="outline" className="gap-1 pr-1">
                  {coupon.code}
                  <button type="submit" disabled={removing} aria-label={`Remove coupon ${coupon.code}`}>
                    <X className="size-3" />
                  </button>
                </Badge>
              </form>
            ))}
          </div>
        )}
        <form action={applyAction} className="flex gap-2">
          <HiddenBasketIdent basketIdent={basketIdent} />
          <Input name="coupon_code" placeholder="Coupon code" className="flex-1" />
          <Button type="submit" size="sm" disabled={applying}>
            Apply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function GiftCardPanel({ basketIdent, giftcards }: { basketIdent: string; giftcards: GiftCard[] }) {
  const [applyState, applyAction, applying] = useActionState(applyGiftCardAction, initialActionState);
  const [removeState, removeAction, removing] = useActionState(
    removeGiftCardAction,
    initialActionState
  );
  const state = removeState.status !== "idle" ? removeState : applyState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift cards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Feedback state={state} />
        {giftcards.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {giftcards.map((card) => (
              <form key={card.card_number} action={removeAction}>
                <HiddenBasketIdent basketIdent={basketIdent} />
                <input type="hidden" name="card_number" value={card.card_number} />
                <Badge variant="outline" className="gap-1 pr-1 font-mono">
                  {card.card_number}
                  <button
                    type="submit"
                    disabled={removing}
                    aria-label={`Remove gift card ${card.card_number}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              </form>
            ))}
          </div>
        )}
        <form action={applyAction} className="flex gap-2">
          <HiddenBasketIdent basketIdent={basketIdent} />
          <Input name="card_number" placeholder="Gift card number" className="flex-1 font-mono" />
          <Button type="submit" size="sm" disabled={applying}>
            Apply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function CreatorCodePanel({
  basketIdent,
  creatorCode,
}: {
  basketIdent: string;
  creatorCode?: string;
}) {
  const [applyState, applyAction, applying] = useActionState(
    applyCreatorCodeAction,
    initialActionState
  );
  const [removeState, removeAction, removing] = useActionState(
    removeCreatorCodeAction,
    initialActionState
  );
  const state = removeState.status !== "idle" ? removeState : applyState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Feedback state={state} />
        {creatorCode ? (
          <form action={removeAction} className="flex items-center gap-2">
            <HiddenBasketIdent basketIdent={basketIdent} />
            <Badge variant="outline" className="font-mono">
              {creatorCode}
            </Badge>
            <Button type="submit" size="xs" variant="outline" disabled={removing}>
              Remove
            </Button>
          </form>
        ) : (
          <form action={applyAction} className="flex gap-2">
            <HiddenBasketIdent basketIdent={basketIdent} />
            <Input name="creator_code" placeholder="Creator code" className="flex-1" />
            <Button type="submit" size="sm" disabled={applying}>
              Apply
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export function AddPackageForm({ basketIdent }: { basketIdent: string }) {
  const [state, action, isPending] = useActionState(addPackageAction, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add package</CardTitle>
        <CardDescription>Adds a package by ID via the token-less basket API.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Feedback state={state} />
        <form action={action} className="flex flex-wrap items-end gap-2">
          <HiddenBasketIdent basketIdent={basketIdent} />
          <div className="space-y-1.5">
            <Label htmlFor="package_id">Package ID</Label>
            <Input id="package_id" name="package_id" className="w-40" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} className="w-24" />
          </div>
          <label className="flex h-8 items-center gap-2 text-sm">
            <input type="checkbox" name="dynamic" className="size-4" />
            Dynamic package
          </label>
          <Button type="submit" size="sm" disabled={isPending} className="gap-1">
            <Plus className="size-3.5" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AuthUrlPanel({ basketIdent }: { basketIdent: string }) {
  const [state, action, isPending] = useActionState(getAuthUrlsAction, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth links</CardTitle>
        <CardDescription>
          Fetch sign-in URLs the customer uses to authorize this basket.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Feedback state={state} />
        <form action={action} className="flex gap-2">
          <HiddenBasketIdent basketIdent={basketIdent} />
          <Input
            name="returnUrl"
            placeholder="https://example.tebex.io/"
            className="flex-1"
            defaultValue="https://example.tebex.io/"
            required
          />
          <Button type="submit" size="sm" disabled={isPending}>
            Get links
          </Button>
        </form>
        {state.status === "success" && state.data !== undefined && (
          <JSONViewer data={state.data} label="Auth links" defaultOpen />
        )}
      </CardContent>
    </Card>
  );
}
