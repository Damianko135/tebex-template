"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

import { ActionFeedback } from "@/components/action-feedback";
import { Button } from "@/components/ui/button";
import { initialActionState } from "@/lib/action-state";
import { addToBasketAction } from "@/lib/store/actions";
import { cn } from "@/lib/utils";

export function AddToBasketForm({
  packageId,
  className,
  size = "default",
  showQuantity = false,
  disableQuantity = false,
}: {
  packageId: number | string;
  className?: string;
  size?: "sm" | "default" | "lg";
  showQuantity?: boolean;
  disableQuantity?: boolean;
}) {
  const [state, action, isPending] = useActionState(addToBasketAction, initialActionState);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Surfaces a brief "Added" confirmation on the button itself, since this
  // form is used in tight card layouts where a full alert would be too
  // heavy - see components/action-feedback.tsx's "inline" variant, which
  // otherwise only ever renders on error. `useActionState` returns a new
  // `state` object on every resolution (even repeated identical results),
  // so tracking the previous object via the "adjust state during render"
  // pattern - rather than diffing `status` in an effect - reliably
  // re-triggers the confirmation on each successful click, not just the
  // first. See https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state.status === "success") setJustAdded(true);
  }

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [justAdded]);

  return (
    <form action={action} className={cn("space-y-1.5", className)}>
      <input type="hidden" name="package_id" value={String(packageId)} />
      <input type="hidden" name="quantity" value={quantity} />
      <div className="flex items-center gap-2">
        {showQuantity && !disableQuantity && (
          <div className="flex items-center rounded-md border border-border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        )}
        <Button type="submit" size={size} disabled={isPending} className="flex-1 gap-1.5">
          {justAdded ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {isPending ? "Adding..." : justAdded ? "Added" : "Add to basket"}
        </Button>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {justAdded ? "Added to basket." : ""}
      </span>
      <ActionFeedback state={state} variant="inline" />
    </form>
  );
}
