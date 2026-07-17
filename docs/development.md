# Development

## Prerequisites

- Node.js + [pnpm](https://pnpm.io) (this repo uses pnpm workspaces — see `pnpm-workspace.yaml`).
- Optionally, Docker, for a local Redis/Valkey instance (`compose.yml`).

## Setup

```bash
pnpm install
cp .env.example .env   # then fill in values — see environment-variables.md
```

Nothing is strictly required to run the app: with `TEBEX_STORE_TOKEN`/`REDIS_URL` unset, every
page falls back to a "not configured" state and an in-memory store respectively (see
[environment-variables.md](./environment-variables.md)). For anything beyond the emptiest smoke
test, though, set at least `TEBEX_STORE_TOKEN`.

```bash
docker compose up -d   # optional local Redis/Valkey, matches REDIS_URL=redis://localhost:6379
pnpm dev                # next dev
```

The first time the server starts with `ADMIN_USERNAME`/`ADMIN_PASSWORD` set and zero admin
accounts existing, it bootstraps the first admin automatically — see
[authentication.md](./authentication.md#bootstrapping-the-first-admin).

## Scripts

| Command | Effect |
| --- | --- |
| `pnpm dev` | `next dev` |
| `pnpm build` | `next build` |
| `pnpm start` | `next start` (run `build` first) |
| `pnpm lint` | `eslint` |

## Workspace layout

```text
.                  the Next.js app (this package)
tebex/              the generated tebex-headless client (separate pnpm workspace package)
```

Regenerating the Tebex API client after an upstream schema change:

```bash
cd tebex
pnpm run update   # fetch-schema && generate && build-manifest
```

See [tebex-integration.md](./tebex-integration.md) for what each step in `pnpm run update` does
and why the client is generated rather than hand-written.

## Verifying a change before considering it done

```bash
npx tsc --noEmit -p tsconfig.json
npx eslint .
npx next build
```

All three should be clean (build produces zero TypeScript errors and zero eslint errors — a
handful of pre-existing `no-unused-vars` *warnings* on intentionally-unused `useActionState`
`prevState` parameters are expected and harmless).

**If your change touches a page that only renders in the "Tebex not configured" fallback state
during local dev**, smoke-test it with a real `TEBEX_STORE_TOKEN` at least once before calling it
done — see the gotcha in [admin-dashboard.md](./admin-dashboard.md#gotcha-datatable-is-a-client-component)
for a concrete example of a bug that only surfaced with real data.

## shadcn / component generation

`components.json` configures the [shadcn CLI](https://ui.shadcn.com) (`style: base-nova`, icons
via `lucide-react`, Tailwind CSS file at `lib/ui/globals.css`). When adding a new shadcn primitive,
run the CLI rather than hand-copying a component — and afterward double-check
`components.json`'s `tailwind.css` field still points at `lib/ui/globals.css`; it has
self-healed to a stale path before when CSS files under `lib/ui/` were renamed/deleted.
