import "server-only";

import type { components } from "tebex-headless";

import { createBasket } from "@/lib/tebex/mutations";
import { getBasket } from "@/lib/tebex/queries";
import { getSiteOrigin } from "@/lib/site";

import { getBasketIdent, setBasketIdent } from "./basket-cookie";

export type Basket = components["schemas"]["Basket"];

/** Reads the visitor's basket if one already exists. Never creates one, so
 * it's safe to call from a plain Server Component render. */
export async function getCurrentBasket(): Promise<Basket | null> {
  const ident = await getBasketIdent();
  if (!ident) return null;
  const result = await getBasket(ident);
  if (!result.ok) return null;
  return result.data.data ?? null;
}

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
