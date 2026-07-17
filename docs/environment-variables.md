# Environment variables

See `.env.example` for the canonical, copy-pasteable list. This doc explains what each one
actually does and what happens when it's left unset.

## Tebex

| Variable | Required | Effect when unset |
| --- | --- | --- |
| `TEBEX_STORE_TOKEN` | For live data | `lib/tebex/client.ts`'s `getTebexClient()` returns `null`. Every query/mutation in `lib/tebex/` short-circuits to a `TebexNotConfiguredError` result instead of calling the network, and pages render an `ErrorPanel` "Store not connected" state instead of crashing. The app still builds and runs with this unset. |

Your webstore's **public token**, scoping every Headless API request to
`https://headless.tebex.io/api/accounts/{token}`. Get it from your Tebex Webstore Builder. See
[tebex-integration.md](./tebex-integration.md).

There is no environment variable for a Checkout API Project ID / Private Key — this app doesn't
use the Checkout API. See [tebex-integration.md](./tebex-integration.md) for why.

## Storage (theme + admin auth)

| Variable | Required | Effect when unset |
| --- | --- | --- |
| `REDIS_URL` | No | Both the theme store (`lib/storage/storage.ts`) and the admin-auth store (`lib/redis.ts`) fall back to an in-process in-memory store, with a `console.warn` at startup. The app runs and builds normally; data (theme overrides, admin accounts/sessions) just doesn't persist across restarts or across multiple server instances. |

One Redis/Valkey instance backs two independent things: theme overrides (via unstorage's Redis
driver) and Better Auth's admin user/session data (via a custom adapter, `lib/auth-redis-adapter.ts`,
using raw `ioredis` commands). They're namespaced separately (`theme:active` vs
`betterauth:{model}:{id}`) so one `REDIS_URL` is enough for both.

## Admin authentication (Better Auth)

| Variable | Required | Effect when unset |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yes, for production | Signs/encrypts sessions and cookies. Generate with `openssl rand -base64 32`. Read automatically by the `betterAuth()` call in `lib/auth.ts` — never referenced directly via `process.env` in this codebase. |
| `BETTER_AUTH_URL` | Yes | The base URL this app is served from, used to build auth callback URLs. Defaults to `http://localhost:3000` for local dev. |
| `ADMIN_USERNAME` | For bootstrap only | Combined with `ADMIN_PASSWORD`, creates the very first administrator account the first time the server starts with zero admins in the store (see `lib/auth-bootstrap.ts`, invoked from `instrumentation.ts`'s `register()`). If unset when no admin exists yet, the server logs a warning and admin login stays unusable until you set both and restart. |
| `ADMIN_PASSWORD` | For bootstrap only | See above. Better Auth's `minPasswordLength` defaults to 8 characters. |
| `ADMIN_EMAIL` | No | Better Auth's schema always has an `email` column even though this app only asks for a username. If unset, one is synthesized as `{username}@admin.local` — never shown in the UI, has no effect on sign-in. |

**Important:** `ADMIN_USERNAME`/`ADMIN_PASSWORD` are *bootstrap-only*. They're never compared
against on login — `ensureInitialAdmin()` creates a real Better Auth user with a securely hashed
password on first run, and all sign-ins afterward go through Better Auth's normal
username/password flow. Changing these env vars after the first admin exists has no effect.

See [authentication.md](./authentication.md) for the full picture.

## Site URL

| Variable | Required | Effect when unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | `lib/site.ts`'s `getSiteOrigin()` (used to build `completeUrl`/`cancelUrl` for baskets, and the return URL for basket auth) falls back to reconstructing the origin from the incoming request's `host`/`x-forwarded-proto` headers. Set this explicitly in production behind a proxy/CDN where those headers might not be trustworthy or present. |

## Standard Next.js / Node variables

`NODE_ENV` is read once, by `lib/store/basket-cookie.ts`, to decide whether the basket-identity
cookie gets the `secure` flag (`true` in production). You don't need to set this yourself — Next.js
sets it automatically for `next dev` / `next build` / `next start`.
