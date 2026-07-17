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

## Admin auth: two modes, chosen by whether `REDIS_URL` is set

Admin auth has two independent implementations, selected once per request by the same
`redis` check `lib/storage/storage.ts`/`lib/redis.ts` already use elsewhere in this app: if
`REDIS_URL` is set, everything goes through real Better Auth + Redis; if it's unset, a much
simpler stateless fallback takes over. **The switch is based on whether `REDIS_URL` is
configured, not on live Redis reachability** — if you set `REDIS_URL` to an address nothing is
listening on, admin auth will try (and fail) to use Redis rather than silently degrading to the
fallback. Point `REDIS_URL` at a real instance, or unset it entirely to use the fallback on
purpose.

Both modes are wired through one shared entry point, `lib/auth-actions.ts`'s `loginAction`/
`signOutAction` — `components/admin/login-form.tsx` and the sidebar's sign-out button call these
and never need to know which mode is active.

### With `REDIS_URL`: Better Auth + a Redis adapter

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

`lib/auth-redis-adapter.ts`'s `redisAdapter()` implements Better Auth's `createAdapterFactory`
interface directly on top of `ioredis` (`lib/redis.ts`, a separate connection from the theme
system's — see [theming.md](./theming.md)). Each model (user, session, account, verification) is
stored as one JSON blob per row (`betterauth:{model}:{id}`) plus a per-model Redis Set tracking
which ids exist (`betterauth:{model}:__index__`). `where`/sort/select happen in JS after loading a
model's rows — fine at admin-console scale (a handful of accounts/sessions), not built for high
volume.

**Bootstrapping the first admin:** `lib/auth-bootstrap.ts`'s `ensureInitialAdmin()` runs once at
server startup, from `instrumentation.ts`'s `register()` (skipped when `REDIS_URL` is unset, and
on the Edge runtime — `ioredis` is Node-only). It checks whether any user exists at all; if not,
and `ADMIN_USERNAME`/`ADMIN_PASSWORD` are set, it creates a real Better Auth user with a securely
hashed password via Better Auth's own internal adapter. After that first account exists, those env
vars have no further effect on this path — see [environment-variables.md](./environment-variables.md).

### Without `REDIS_URL`: `lib/auth-simple.ts`, a stateless fallback

Better Auth's Redis adapter has an in-process `Map`-based fallback built in for when `REDIS_URL`
is unset, but relying on mutable server state for admin sessions turned out to be fragile in
practice — it doesn't reliably survive Next.js dev-mode module reloads, and building a working
"account" out of an in-memory store is more machinery than a zero-setup demo path is worth.
`lib/auth-simple.ts` replaces that entirely when Redis isn't configured:

- **No account, no session store.** `signInSimple(username, password)` compares directly against
  `ADMIN_USERNAME`/`ADMIN_PASSWORD` on every sign-in — there's no user record to create or bootstrap.
- **The "session" is a signed cookie**, not a server-side session lookup: `username.HMAC(username)`,
  keyed by `BETTER_AUTH_SECRET` (already required for the Redis path). `getSimpleSession()`
  recomputes the signature and rejects anything that doesn't match in constant time
  (`crypto.timingSafeEqual`) — this still gates real write access (tiers, coupons, baskets), so it's
  not just a cosmetic login screen even in demo mode.
- If `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`BETTER_AUTH_SECRET` aren't all set, this mode simply never
  authenticates anyone (fails closed).

The two modes' cookies are not interchangeable — a Better Auth session cookie means nothing to
`getSimpleSession()` and vice versa. Don't flip `REDIS_URL` on and off while a session is active;
sign in again after switching.

### The auth boundary

`app/admin/(protected)/layout.tsx` and `app/admin/login/page.tsx` both check
`redis ? auth.api.getSession(...) : getSimpleSession()` and redirect to/from `/admin/login`
accordingly. `app/admin/login/` deliberately lives **outside** the `(protected)` route group so
the login page itself isn't gated by the auth check it exists to satisfy.

## Storefront "auth": basket-scoped, not account-based

The Headless API has no user accounts, sessions, or login concept for customers — only
`getBasketAuthUrl`, which returns per-provider (e.g. Steam) sign-in links tied to the *current
basket*. A customer authorizing their basket unlocks member pricing/tiers/creator codes tied to
their in-game identity, not a "logged in" state this app tracks itself. There's no server-side
session to check for this — `/account/sign-in` just calls `getSignInLinksAction()`
(`lib/store/actions.ts`), which creates a basket if needed and fetches those provider links.
