import "server-only";

import { cache } from "react";
import type { components } from "tebex-headless";

import { createBasket } from "@/lib/tebex/mutations";
import { getBasket } from "@/lib/tebex/queries";
import type { TebexResult } from "@/lib/tebex/queries";
import { getSiteOrigin } from "@/lib/site";

import { getBasketIdent, setBasketIdent } from "./basket-cookie";

export type Basket = components["schemas"]["Basket"];

/** Reads the visitor's basket if one already exists. Never creates one, so
 * it's safe to call from a plain Server Component render.
 *
 * Returns `{ ok: true, basket: null }` when the visitor genuinely has no
 * basket yet (no cookie set) - distinct from `{ ok: false }`, which means
 * the API call itself failed. Callers must not treat the two the same way:
 * collapsing a failed fetch into "no basket" would make a shopper with a
 * real, non-empty basket see "Your basket is empty" on a transient API
 * blip.
 *
 * Wrapped in `cache()` since the header (`StorefrontShell`) and the page
 * body (`/basket`, `/checkout/success`) each call this independently in the
 * same request - without memoization, two separate fetches could
 * independently succeed/fail, producing a page where the header shows a
 * normal cart badge while the body shows an error, or vice versa. */
export const getCurrentBasket = cache(async (): Promise<TebexResult<Basket | null>> => {
  const ident = await getBasketIdent();
  if (!ident) return { ok: true, data: null };
  const result = await getBasket(ident);
  if (!result.ok) return result;
  return { ok: true, data: result.data.data ?? null };
});

/** Resolves the visitor's basket identifier, creating a new basket (and
 * setting its cookie) if none exists yet or the stored one is no longer
 * valid. Sets a cookie, so this may only be called from a Server Action or
 * Route Handler. */
export async function getOrCreateBasketIdent(): Promise<string> {
  const existing = await getBasketIdent();
  if (existing) {
    const result = await getBasket(existing);
    // A completed basket has already been paid for - don't keep adding new
    // items to it. Falling through here creates a fresh one instead.
    if (result.ok && result.data.data && !result.data.data.complete) return existing;
  }

  const origin = await getSiteOrigin();
  const created = await createBasket({
    completeUrl: `${origin}/checkout/success`,
    cancelUrl: `${origin}/checkout/cancel`,
  });

  if (!created.ok) throw new Error(created.error.message);
  const ident = created.data.data?.ident;
  if (!ident) throw new Error("Basket was created but no identifier was returned.");

  await setBasketIdent(ident);
  return ident;
}
