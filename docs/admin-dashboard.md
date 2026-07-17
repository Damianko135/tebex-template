# Admin dashboard

`/admin` is a schema-driven console over the Headless API, covering every operation in
`tebex/openapi.yaml`. It's gated by Better Auth — see [authentication.md](./authentication.md).

## What it can and can't do

The Headless API is a **storefront/checkout API, not a management CRUD API**:

- There's no create/edit/delete for categories or packages — that's done in Tebex's Webstore
  Builder. The admin pages for these are read-heavy browsing (`DataTable` + detail pages), not
  forms.
- There's no "list all baskets" endpoint. `/admin/baskets` is a create-new-basket-or-look-up-an-
  existing-one-by-ident workflow instead of a list.
- Tiers and dynamic-category packages have real mutation forms (`/admin/tiers`,
  `/admin/baskets/[basketIdent]`) because the API actually supports mutating them.

Don't try to add catalog editing here — see [tebex-integration.md](./tebex-integration.md) for why
that's a Checkout-API-shaped (different) product, not a gap in this one.

## Layout and navigation

`components/admin/admin-shell.tsx` + `app-sidebar.tsx` provide one persistent `SidebarProvider` for
the whole `/admin` layout. Adding a page means adding an entry to
`components/admin/nav-config.ts`'s `NAV_GROUPS` — the sidebar renders directly from that list, so
there's no separate registration step.

## Shared building blocks (`components/admin/`)

| Component | Purpose |
| --- | --- |
| `DataTable` | Generic client-side search/sort/paginate table. `"use client"` — see the gotcha below. |
| `PropertyGrid` / `PropertyValue` | Recursive label/value grid for rendering an arbitrary API response object. Accepts `unknown` rather than a closed JSON type because several schema fields (`Package.options`/`variables`) are underspecified `unknown[]`. |
| `JSONViewer` | Collapsible raw-JSON panel with copy-to-clipboard, present on every detail page as a fallback/debugging aid. |
| `PageHeader` | Breadcrumbs + title + description + actions, used at the top of every page. |
| `MetricCard` / `StatGrid` | Dashboard summary tiles. |
| `status-badge.tsx` (`BooleanBadge`, `EnumBadge`, `NullableValue`) | Small formatting primitives reused across every table/detail page. |
| `api-explorer.tsx` | Renders `ENDPOINT_MANIFEST` (generated — see [tebex-integration.md](./tebex-integration.md)) as a searchable reference of every Headless API operation. |

## Adding a new resource page

Follow the existing per-resource pattern:

1. Add a query/mutation wrapper in `lib/tebex/queries.ts` / `mutations.ts` if one doesn't exist
   yet (see [tebex-integration.md](./tebex-integration.md)).
2. List page: fetch server-side, render `<DataTable>` with resource-specific columns (see
   `components/admin/category-table.tsx` / `package-table.tsx` / `cms-page-table.tsx` for the
   pattern) or an `<EmptyState>`/`<ErrorPanel>` for the empty/error cases.
3. Detail page (`[id]/page.tsx`): fetch by id, `notFound()` if missing, render `<PropertyGrid>` +
   `<JSONViewer>`.
4. Add the entry to `components/admin/nav-config.ts`.

### Gotcha: `DataTable` is a Client Component

`DataTable` takes `columns` (which contain `render` closures) and an optional `searchFn` as props.
Both must be defined in a `"use client"` file — React only allows Server Actions, not arbitrary
functions, to cross the Server→Client Component boundary. If you pass columns/searchFn directly
from a Server Component `page.tsx`, it type-checks and builds fine but throws at runtime the moment
a real Tebex-connected response actually reaches `<DataTable>` — the "not configured" fallback
path silently masks this until then. Always wrap resource-specific table logic in its own
`"use client"` component (`category-table.tsx`, `cms-page-table.tsx`, `package-table.tsx` are the
existing examples) that takes plain serializable data as props.

**Corollary:** any admin (or storefront) page reaching a real data branch should be smoke-tested
with a real `TEBEX_STORE_TOKEN` at least once before considering it done — the unconfigured-store
fallback path can hide bugs that only appear once there's actual data.

## Basic-auth-gated operations

`/admin/tiers` (`getUserTieredCategories`, `updateTier`) asks the operator to type in basic-auth
credentials per request rather than storing them — see
[tebex-integration.md](./tebex-integration.md#basic-auth-gated-operations).
