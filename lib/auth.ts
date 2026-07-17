import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";

import { redisAdapter } from "./auth-redis-adapter";

/**
 * Authenticates administrators of this application (the /admin dashboard)
 * only. It has nothing to do with Tebex customer accounts, baskets, or
 * checkout - those are handled entirely by the Tebex Headless API (see
 * `lib/tebex/*` and `lib/store/*`). Every user this system knows about is an
 * administrator; there is no separate customer identity here.
 *
 * `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are read from the environment
 * automatically and intentionally not set here.
 */
export const auth = betterAuth({
  appName: "Store Admin",
  database: redisAdapter(),
  emailAndPassword: {
    enabled: true,
    // No public registration - the only administrator accounts are the
    // bootstrap admin (see lib/auth-bootstrap.ts) and whoever an existing
    // administrator creates later through an internal, authenticated flow.
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day of activity
  },
  user: {
    additionalFields: {
      // Every account here is an administrator today. This field is a seam
      // for future differentiation (e.g. "owner" vs "admin") without a
      // schema migration once roles/permissions are actually needed.
      role: {
        type: "string",
        defaultValue: "admin",
        input: false,
      },
    },
  },
  plugins: [
    // Sign-in by username (e.g. "admin") instead of email, for a simpler v1
    // login. Better Auth's `user` table always has an `email` column
    // underneath - the bootstrap admin gets a placeholder one (see
    // lib/auth-bootstrap.ts), but nothing in the UI ever shows or asks for
    // it. A v2 that wants real email flows (verification, password reset
    // emails) can add `email` back to the login form later without
    // touching this schema.
    username(),
    // Lets Better Auth set/clear session cookies when its API is called
    // directly from Next.js Server Components/Actions (e.g. the bootstrap
    // script and the admin layout's session check).
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
