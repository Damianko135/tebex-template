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
| `REDIS_URL` | No | The theme store (`lib/storage/storage.ts`) falls back to an in-process in-memory store. Admin auth (`lib/redis.ts`) switches entirely to `lib/auth-simple.ts`'s stateless, credential-comparison fallback instead of trying to run Better Auth against an in-memory store - see [authentication.md](./authentication.md). Both log a `console.warn` at startup. The app runs and builds normally either way; theme overrides just don't persist across restarts/instances. |

One Redis/Valkey instance backs two independent things: theme overrides (via unstorage's Redis
driver) and Better Auth's admin user/session data (via a custom adapter, `lib/auth-redis-adapter.ts`,
using raw `ioredis` commands). They're namespaced separately (`theme:active` vs
`betterauth:{model}:{id}`) so one `REDIS_URL` is enough for both.

## Admin authentication (Better Auth)

| Variable | Required | Effect when unset |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yes, for production | Signs/encrypts sessions and cookies. Generate with `openssl rand -base64 32`. Read automatically by the `betterAuth()` call in `lib/auth.ts` — never referenced directly via `process.env` in this codebase. |
| `BETTER_AUTH_URL` | Yes | The base URL this app is served from, used to build auth callback URLs. Defaults to `http://localhost:3000` for local dev. |
| `ADMIN_USERNAME` | Yes (see note) | **With `REDIS_URL`:** bootstrap-only - creates the very first administrator account the first time the server starts with zero admins in the store (see `lib/auth-bootstrap.ts`). **Without `REDIS_URL`:** required on every sign-in - `lib/auth-simple.ts` compares credentials directly against this env var each time, there's no stored account. |
| `ADMIN_PASSWORD` | Yes (see note) | Same split as above. Better Auth's `minPasswordLength` (Redis path) defaults to 8 characters; the no-Redis path doesn't enforce a minimum length itself. |
| `ADMIN_EMAIL` | No | Better Auth's schema always has an `email` column even though this app only asks for a username. If unset, one is synthesized as `{username}@admin.local` — never shown in the UI, has no effect on sign-in. Only relevant to the Redis path; the no-Redis fallback doesn't use it. |

**Important:** whether `ADMIN_USERNAME`/`ADMIN_PASSWORD` matter *only once* or *on every sign-in*
depends entirely on `REDIS_URL`. With Redis, they're bootstrap-only: `ensureInitialAdmin()` creates
a real Better Auth user with a securely hashed password on first run, and changing the env vars
afterward has no effect - all sign-ins go through Better Auth's normal stored-account flow.
Without Redis, there's no stored account at all, so these env vars **are** the credentials, checked
fresh on every sign-in - changing them takes effect immediately (existing sessions/cookies from
before the change stop verifying).

See [authentication.md](./authentication.md) for the full picture.

## Site URL

| Variable | Required | Effect when unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | `lib/site.ts`'s `getSiteOrigin()` (used to build `completeUrl`/`cancelUrl` for baskets, and the return URL for basket auth) falls back to reconstructing the origin from the incoming request's `host`/`x-forwarded-proto` headers. Set this explicitly in production behind a proxy/CDN where those headers might not be trustworthy or present. |

## Standard Next.js / Node variables

`NODE_ENV` is read once, by `lib/store/basket-cookie.ts`, to decide whether the basket-identity
cookie gets the `secure` flag (`true` in production). You don't need to set this yourself — Next.js
sets it automatically for `next dev` / `next build` / `next start`.
