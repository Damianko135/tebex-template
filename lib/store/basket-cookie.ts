import "server-only";

import { cookies } from "next/headers";

const BASKET_COOKIE = "tebex_basket_ident";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function getBasketIdent(): Promise<string | null> {
  const store = await cookies();
  return store.get(BASKET_COOKIE)?.value ?? null;
}

/** Only callable from a Server Action or Route Handler. */
export async function setBasketIdent(ident: string): Promise<void> {
  const store = await cookies();
  store.set(BASKET_COOKIE, ident, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Only callable from a Server Action or Route Handler. */
export async function clearBasketIdent(): Promise<void> {
  const store = await cookies();
  store.delete(BASKET_COOKIE);
}
