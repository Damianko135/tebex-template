# Authentication

This app has **two completely separate identity systems** that don't interact:

| | Protects | Backed by | Identity |
| --- | --- | --- | --- |
| **Better Auth** (`lib/auth.ts`) | `/admin/*` only | Redis, via a custom adapter | Administrator accounts you create |
| **Tebex basket auth** (`lib/store/actions.ts`'s `getSignInLinksAction`) | Nothing server-side — it's per-provider sign-in links (e.g. Steam) tied to a basket | Tebex itself | Storefront customers |

There is no "customer account" concept in this app at all — every account Better Auth knows about
is an administrator. If you're looking for customer login/order-history, that's not implemented
here; the Headless API's only related concept is `getBasketAuthUrl`, surfaced at
`/account/sign-in` (`components/store/sign-in-panel.tsx`).

## Admin auth: Better Auth + a Redis adapter

`lib/auth.ts` configures [Better Auth](https://better-auth.com):

- **Sign-in by username**, not email (the `username()` plugin) — simpler UX for a small number of
  internal admin accounts. Better Auth's schema always has an `email` column underneath; see
  [environment-variables.md](./environment-variables.md)'s `ADMIN_EMAIL` entry.
- **No public registration** (`disableSignUp: true`) — the only way to get an account is the
  bootstrap flow below, or (in the future) an authenticated admin creating one.
- **7-day sessions**, refreshed once per day of activity.
- A `role` field on the user schema, defaulting to `"admin"` — a seam for future
  owner-vs-admin differentiation without a schema migration, unused today (every account is
  functionally identical).

### The Redis adapter (`lib/auth-redis-adapter.ts`)

Better Auth needs a database adapter; this app doesn't have a relational database, so
`redisAdapter()` implements Better Auth's `createAdapterFactory` interface directly on top of
`ioredis` (`lib/redis.ts`, a separate connection from the theme system's — see below). Each model
(user, session, account, verification) is stored as one JSON blob per row
(`betterauth:{model}:{id}`) plus a per-model Redis Set tracking which ids exist
(`betterauth:{model}:__index__`). `where`/sort/select happen in JS after loading a model's rows —
fine at admin-console scale (a handful of accounts/sessions), not built for high volume.

Falls back to an in-process `Map`-based store when `REDIS_URL` is unset, same philosophy as the
theme system (see [theming.md](./theming.md)) — the app still runs and builds with zero external
services configured.

### Bootstrapping the first admin

`lib/auth-bootstrap.ts`'s `ensureInitialAdmin()` runs once at server startup, from
`instrumentation.ts`'s `register()` (skipped on the Edge runtime — `ioredis` is Node-only). It
checks whether any user exists at all; if not, and `ADMIN_USERNAME`/`ADMIN_PASSWORD` are set, it
creates a real Better Auth user with a securely hashed password via Better Auth's own internal
adapter. After that first account exists, those env vars have no further effect — see
[environment-variables.md](./environment-variables.md).

### The auth boundary

`app/admin/(protected)/layout.tsx` checks `auth.api.getSession()` and redirects to `/admin/login`
if there's no session. `app/admin/login/` deliberately lives **outside** the `(protected)` route
group so the login page itself isn't gated by the auth check it exists to satisfy.

## Storefront "auth": basket-scoped, not account-based

The Headless API has no user accounts, sessions, or login concept for customers — only
`getBasketAuthUrl`, which returns per-provider (e.g. Steam) sign-in links tied to the *current
basket*. A customer authorizing their basket unlocks member pricing/tiers/creator codes tied to
their in-game identity, not a "logged in" state this app tracks itself. There's no server-side
session to check for this — `/account/sign-in` just calls `getSignInLinksAction()`
(`lib/store/actions.ts`), which creates a basket if needed and fetches those provider links.
