"use client";

import { useActionState } from "react";
import { X } from "lucide-react";
import type { components } from "tebex-headless";

import { ActionFeedback } from "@/components/action-feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialActionState } from "@/lib/action-state";
import {
  applyCouponAction,
  applyCreatorCodeAction,
  applyGiftCardAction,
  removeCouponAction,
  removeCreatorCodeAction,
  removeGiftCardAction,
} from "@/lib/store/actions";

type Coupon = components["schemas"]["Coupon"];
type GiftCard = components["schemas"]["GiftCard"];

function Feedback({ state }: { state: { status: "idle" | "success" | "error"; message?: string } }) {
  return <ActionFeedback state={state} variant="inline" />;
}

export function BasketDiscounts({
  basketIdent,
  coupons,
  giftcards,
  creatorCode,
}: {
  basketIdent: string;
  coupons: Coupon[];
  giftcards: GiftCard[];
  creatorCode?: string;
}) {
  const [applyCouponState, applyCoupon, applyingCoupon] = useActionState(applyCouponAction, initialActionState);
  const [removeCouponState, removeCoupon, removingCoupon] = useActionState(
    removeCouponAction,
    initialActionState
  );
  const couponState = removeCouponState.status !== "idle" ? removeCouponState : applyCouponState;

  const [applyGiftCardState, applyGiftCard, applyingGiftCard] = useActionState(
    applyGiftCardAction,
    initialActionState
  );
  const [removeGiftCardState, removeGiftCard, removingGiftCard] = useActionState(
    removeGiftCardAction,
    initialActionState
  );
  const giftCardState = removeGiftCardState.status !== "idle" ? removeGiftCardState : applyGiftCardState;

  const [applyCreatorState, applyCreatorCode, applyingCreatorCode] = useActionState(
    applyCreatorCodeAction,
    initialActionState
  );
  const [removeCreatorState, removeCreatorCode, removingCreatorCode] = useActionState(
    removeCreatorCodeAction,
    initialActionState
  );
  const creatorState = removeCreatorState.status !== "idle" ? removeCreatorState : applyCreatorState;

  return (
    <div className="rounded-lg border border-border p-4">
      <Tabs defaultValue="coupon">
        <TabsList className="w-full">
          <TabsTrigger value="coupon" className="flex-1">Coupon</TabsTrigger>
          <TabsTrigger value="giftcard" className="flex-1">Gift card</TabsTrigger>
          <TabsTrigger value="creator" className="flex-1">Creator code</TabsTrigger>
        </TabsList>

        <TabsContent value="coupon" className="space-y-2 pt-3">
          {coupons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {coupons.map((coupon) => (
                <form key={coupon.code} action={removeCoupon}>
                  <input type="hidden" name="basketIdent" value={basketIdent} />
                  <input type="hidden" name="coupon_code" value={coupon.code} />
                  <Badge variant="outline" className="gap-1 pr-1">
                    {coupon.code}
                    <button
                      type="submit"
                      disabled={removingCoupon}
                      aria-label={`Remove coupon ${coupon.code}`}
                      className="rounded-full opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 disabled:pointer-events-none"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                </form>
              ))}
            </div>
          )}
          <form action={applyCoupon} className="flex gap-2">
            <input type="hidden" name="basketIdent" value={basketIdent} />
            <Input name="coupon_code" placeholder="Coupon code" aria-label="Coupon code" className="flex-1" />
            <Button type="submit" size="sm" disabled={applyingCoupon}>
              Apply
            </Button>
          </form>
          <Feedback state={couponState} />
        </TabsContent>

        <TabsContent value="giftcard" className="space-y-2 pt-3">
          {giftcards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {giftcards.map((card) => (
                <form key={card.card_number} action={removeGiftCard}>
                  <input type="hidden" name="basketIdent" value={basketIdent} />
                  <input type="hidden" name="card_number" value={card.card_number} />
                  <Badge variant="outline" className="gap-1 pr-1 font-mono">
                    {card.card_number}
                    <button
                      type="submit"
                      disabled={removingGiftCard}
                      aria-label="Remove gift card"
                      className="rounded-full opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 disabled:pointer-events-none"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                </form>
              ))}
            </div>
          )}
          <form action={applyGiftCard} className="flex gap-2">
            <input type="hidden" name="basketIdent" value={basketIdent} />
            <Input
              name="card_number"
              placeholder="Gift card number"
              aria-label="Gift card number"
              className="flex-1 font-mono"
            />
            <Button type="submit" size="sm" disabled={applyingGiftCard}>
              Apply
            </Button>
          </form>
          <Feedback state={giftCardState} />
        </TabsContent>

        <TabsContent value="creator" className="space-y-2 pt-3">
          {creatorCode ? (
            <form action={removeCreatorCode} className="flex items-center gap-2">
              <input type="hidden" name="basketIdent" value={basketIdent} />
              <Badge variant="outline" className="font-mono">
                {creatorCode}
              </Badge>
              <Button type="submit" size="xs" variant="outline" disabled={removingCreatorCode}>
                Remove
              </Button>
            </form>
          ) : (
            <form action={applyCreatorCode} className="flex gap-2">
              <input type="hidden" name="basketIdent" value={basketIdent} />
              <Input name="creator_code" placeholder="Creator code" aria-label="Creator code" className="flex-1" />
              <Button type="submit" size="sm" disabled={applyingCreatorCode}>
                Apply
              </Button>
            </form>
          )}
          <Feedback state={creatorState} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
