"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Progressive enhancement over a plain link to Tebex's hosted checkout
 * (`href`, from `basket.links.checkout`): `@tebexio/tebex.js` is
 * dynamically imported only on click (so it never adds to the initial
 * page's JS bundle), and if it loads and launches successfully, checkout
 * opens as an embedded popup instead of navigating away. The plain link
 * still works as-is if JS is disabled, or if the widget fails to load
 * (e.g. blocked by an ad/tracker blocker, which does happen to payment
 * iframes) - `handleClick` only calls `preventDefault()` once the popup has
 * actually launched.
 *
 * `payment:complete` is used only to navigate to the success page for a
 * smooth in-app handoff - never to confirm the payment itself. Tebex.js's
 * own docs are explicit that its events aren't a substitute for webhooks,
 * and this app already treats `/checkout/success` as re-reading the basket
 * fresh from the API rather than trusting client state (see
 * app/(store)/checkout/success/page.tsx).
 */
export function CheckoutLink({
  href,
  basketIdent,
  className,
}: {
  href: string;
  basketIdent: string;
  className?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "launching" | "error">("idle");

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!basketIdent || status === "launching") return;
    event.preventDefault();
    setStatus("launching");

    try {
      const { default: Tebex } = await import("@tebexio/tebex.js");
      Tebex.checkout.init({
        ident: basketIdent,
        theme: "auto",
        closeOnClickOutside: true,
        closeOnEsc: true,
        closeOnPaymentComplete: true,
      });
      Tebex.checkout.on("payment:complete", () => router.push("/checkout/success"));
      Tebex.checkout.on("close", () => setStatus("idle"));
      Tebex.checkout.on("payment:error", () => setStatus("error"));
      await Tebex.checkout.launch();
    } catch (error) {
      console.error("Embedded checkout failed to load, falling back to hosted checkout.", error);
      window.location.href = href;
    }
  }

  return (
    <div className={className}>
      <Button
        size="lg"
        className="w-full"
        aria-disabled={status === "launching"}
        render={
          <a
            href={href}
            onClick={handleClick}
            className={cn(status === "launching" && "pointer-events-none opacity-70")}
          />
        }
      >
        {status === "launching" ? "Loading checkout..." : "Proceed to checkout"}
      </Button>
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-destructive">
          The payment could not be processed. Please try again.
        </p>
      )}
    </div>
  );
}
