# Tebex Storefront Template

A [Next.js](https://nextjs.org) App Router application that's both a customer-facing storefront
and an admin dashboard for a [Tebex](https://tebex.io)-powered webstore. Tebex owns the product
catalog and payment processing; this app is the presentation, basket, and checkout layer on top of
it, built on Tebex's Headless API.

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in at least TEBEX_STORE_TOKEN
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront, or
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

Nothing above is strictly required to boot the app — every page degrades to a "not configured"
state without `TEBEX_STORE_TOKEN`, and storage falls back to an in-memory store without
`REDIS_URL`. See [`docs/environment-variables.md`](./docs/environment-variables.md).

## Documentation

Full docs live in [`docs/`](./docs/README.md):

- [Architecture](./docs/architecture.md)
- [Development](./docs/development.md)
- [Environment variables](./docs/environment-variables.md)
- [Tebex integration](./docs/tebex-integration.md)
- [Embedded checkout](./docs/checkout.md)
- [Theming](./docs/theming.md)
- [Authentication](./docs/authentication.md)
- [Admin dashboard](./docs/admin-dashboard.md)
- [Storefront](./docs/storefront.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/[base-ui](https://base-ui.com) ·
Better Auth · Redis (optional) · a generated `tebex-headless` OpenAPI client · `@tebexio/tebex.js`
for embedded checkout.
