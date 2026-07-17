# Documentation

This is a [Next.js](https://nextjs.org) App Router application that is both a customer-facing
storefront and an admin dashboard for a [Tebex](https://tebex.io)-powered webstore. Tebex owns
the product catalog (categories, packages, pricing, CMS pages) and payment processing; this app
is the presentation and basket/checkout layer on top of it via Tebex's **Headless API**.

## Start here

- **[Architecture](./architecture.md)** — how the app is laid out, the two route groups
  (storefront vs admin), and the `lib/` layering.
- **[Development](./development.md)** — running the app locally, the pnpm workspace, and the
  `tebex-headless` client generator.
- **[Environment variables](./environment-variables.md)** — every variable the app reads, what
  it's for, and what happens when it's unset.

## Feature docs

- **[Tebex integration](./tebex-integration.md)** — the Headless API, the generated
  `tebex-headless` client, and why this app uses it instead of the Checkout API or the official
  Node SDK.
- **[Embedded checkout](./checkout.md)** — the `@tebexio/tebex.js` popup checkout and its
  progressive-enhancement fallback.
- **[Theming](./theming.md)** — the server-side, Redis-backed theme system and the admin theme
  editor.
- **[Authentication](./authentication.md)** — Better Auth, admin-only accounts, and how it
  relates (or rather, doesn't) to Tebex customer accounts.
- **[Admin dashboard](./admin-dashboard.md)** — the `/admin` console: what it can and can't do,
  and how to add a new resource page.
- **[Storefront](./storefront.md)** — the customer-facing `/` site: basket identity, Server
  Actions, and rendering conventions.

## One-sentence mental model per area

| Area | One sentence |
| --- | --- |
| `app/(store)/` | Customer-facing pages. Reads Tebex data, writes only basket state. |
| `app/admin/` | Internal console, Better-Auth-gated. Reads Tebex data, writes basket/tier/theme state. |
| `lib/tebex/` | Server-only typed wrapper around the Headless API. Never imported by Client Components. |
| `lib/store/` | Storefront business logic: basket cookie identity, cart Server Actions. |
| `lib/ui/` | The theme system: token shape, Redis persistence, CSS serialization. |
| `lib/storage/`, `lib/redis.ts` | Thin KV/Redis wrappers, both with an in-memory fallback for zero-config local dev. |
| `components/ui/` | Unmodified-where-possible shadcn/base-ui primitives. |
| `components/admin/`, `components/store/` | App-specific composition on top of `components/ui/`. |
| `tebex/` | A separate pnpm workspace package: the OpenAPI-generated `tebex-headless` client consumed by `lib/tebex/`. |
