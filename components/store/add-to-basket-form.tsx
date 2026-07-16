"use client";

import { useActionState, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

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
          <ShoppingCart className="size-4" />
          {isPending ? "Adding..." : "Add to basket"}
        </Button>
      </div>
      {state.status === "error" && <p className="text-xs text-destructive">{state.message}</p>}
    </form>
  );
}
