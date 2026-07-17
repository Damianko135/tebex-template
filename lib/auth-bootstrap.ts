import "server-only";

import { auth } from "./auth";
import { redis } from "./redis";

/**
 * Creates the very first administrator account from `ADMIN_USERNAME` /
 * `ADMIN_PASSWORD` if - and only if - no administrator exists yet. Meant to
 * be called once, at server startup (see `instrumentation.ts`), not on every
 * request.
 *
 * `ADMIN_USERNAME`/`ADMIN_PASSWORD` are bootstrap credentials only: this
 * function creates a real Better Auth user (with a securely hashed
 * password, via Better Auth's own internal adapter) and never compares
 * login attempts against the environment variables directly. After this
 * runs once, `ADMIN_USERNAME`/`ADMIN_PASSWORD` have no further effect - all
 * sign-ins go through the normal Better Auth username/password flow and
 * sessions.
 *
 * Login is by username (v1 - see lib/auth.ts's `username()` plugin), but
 * Better Auth's `user` table always has an `email` column underneath. If
 * `ADMIN_EMAIL` isn't set, a placeholder is synthesized from the username;
 * it's never shown in the UI and has no effect on sign-in.
 *
 * Without `REDIS_URL`, admin auth goes through `lib/auth-simple.ts` instead
 * (see docs/authentication.md) - there's no user record to create, since
 * that path checks `ADMIN_USERNAME`/`ADMIN_PASSWORD` directly on every
 * sign-in rather than storing an account. Nothing to bootstrap.
 */
export async function ensureInitialAdmin(): Promise<void> {
  if (!redis) return;

  const ctx = await auth.$context;

  // Every account in this system is an administrator (there's no separate
  // customer/user tier here - see lib/auth.ts), so "an admin exists" is
  // simply "any user exists".
  const existingUserCount = await ctx.adapter.count({ model: "user" });
  if (existingUserCount > 0) {
    return;
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn(
      "[auth] No administrator account exists yet, and ADMIN_USERNAME/ADMIN_PASSWORD are not set. " +
        "Set both environment variables and restart the server to bootstrap the first admin."
    );
    return;
  }

  const email = process.env.ADMIN_EMAIL?.toLowerCase() || `${username.toLowerCase()}@admin.local`;
  const passwordHash = await ctx.password.hash(password);

  const user = await ctx.internalAdapter.createUser({
    email,
    name: "Administrator",
    username,
    displayUsername: username,
    emailVerified: true,
  });

  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: passwordHash,
  });

  console.log(`[auth] Bootstrapped the first administrator account (username: ${username}).`);
}
