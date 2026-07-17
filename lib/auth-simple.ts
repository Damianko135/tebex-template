import "server-only";

import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "demo_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches lib/auth.ts's Better Auth session length

export interface SimpleSession {
  user: { name: string; email: string };
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function sign(value: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

/**
 * Stateless fallback used only when `REDIS_URL` is unset (see `lib/redis.ts`).
 * `lib/auth-redis-adapter.ts` already falls back to an in-process Map in that
 * case, but relying on mutable server state for admin sessions is fragile -
 * it doesn't reliably survive Next.js dev-mode module reloads - and is more
 * machinery than a zero-setup demo needs. This checks credentials directly
 * against `ADMIN_USERNAME`/`ADMIN_PASSWORD` instead: no database, no session
 * store, nothing that can lose state. The session is an HMAC-signed cookie
 * (keyed by `BETTER_AUTH_SECRET`, already required for the Redis path) so it
 * can't be trivially forged - this still gates real write access (tiers,
 * coupons, baskets), not just a cosmetic login screen.
 */
export async function signInSimple(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!expectedUsername || !expectedPassword || !secret) return false;
  if (!timingSafeEqual(username, expectedUsername) || !timingSafeEqual(password, expectedPassword)) {
    return false;
  }

  const store = await cookies();
  store.set(COOKIE_NAME, `${username}.${sign(username, secret)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return true;
}

export async function getSimpleSession(): Promise<SimpleSession | null> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!expectedUsername || !secret) return null;

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const separatorIndex = token.indexOf(".");
  if (separatorIndex === -1) return null;
  const username = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  if (username !== expectedUsername || !timingSafeEqual(signature, sign(username, secret))) {
    return null;
  }

  return { user: { name: "Administrator", email: `${username}@admin.local` } };
}

export async function signOutSimple(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
