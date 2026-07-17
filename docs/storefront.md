# Storefront

`app/(store)/` is the customer-facing site: home, `/categories`, `/packages`, `/search`,
`/basket`, `/checkout/success|cancel`, `/account/sign-in`, `/pages/[slug]`. It shares one layout,
`components/store/storefront-shell.tsx` (site header/footer), fetching webstore/categories/pages/
basket data in parallel via `Promise.all`.

## Basket identity: an httpOnly cookie, not a session

There's no login required to have a basket. `lib/store/basket-cookie.ts` manages a
`tebex_basket_ident` httpOnly cookie (30-day max age, `secure` in production), and
`lib/store/basket.ts` builds on it:

- **`getCurrentBasket()`** — read-only, safe to call from a plain Server Component render (no
  cookie writes). Returns `null` if there's no basket yet or the lookup fails.
- **`getOrCreateBasketIdent()`** — creates a new basket (and sets the cookie) if none exists, or if
  the stored one is already `complete` (paid — a finished order's basket is never reused for new
  items). **Writes a cookie, so this is only callable from a Server Action or Route Handler**, never
  from a Server Component render.

## Cart mutations: Server Actions, not a client-side cart store

`lib/store/actions.ts` holds every cart Server Action (add/remove/update quantity, coupon/
giftcard/creator-code apply/remove, sign-in links). Each one:

1. Resolves the basket ident (creating one if needed).
2. Calls the matching `lib/tebex/mutations.ts` function.
3. On success, `revalidatePath("/basket")` + `revalidatePath("/", "layout")` (the header's cart
   count needs the second one).
4. Returns an `ActionState` (`lib/action-state.ts`) — `{ status: "idle" | "success" | "error",
   message?, data? }` — which `useActionState` threads back to the form and
   `components/action-feedback.tsx`'s `<ActionFeedback>` renders.

There is no client-side cart state anywhere — every add/remove is a real round-trip to Tebex,
and the UI re-renders from whatever the server returns. This trades a bit of perceived latency for
never having the displayed cart drift out of sync with the actual basket.

### Reading `FormData`

Every Server Action that parses plain `<form>` submissions uses `lib/form-data.ts`'s
`stringField(formData, key)` — a trimmed string or `undefined`, never a thrown exception on a
missing field. Use this rather than reimplementing field extraction; several call sites used to
have their own slightly-diverged copies (one of which threw instead of returning `undefined`,
which crashed a Server Action on an empty, non-`required` form field) before being consolidated.

## Embedded checkout

See [checkout.md](./checkout.md) — the basket page's checkout button.

## Rendering conventions

- Every storefront page is `export const dynamic = "force-dynamic"` and a Server Component by
  default; see [architecture.md](./architecture.md#rendering-model).
- Package/category/CMS-page detail pages export `generateMetadata()` so browser tabs and shared
  links show the real product/category/page title instead of the app-wide default (`app/(store)/
  layout.tsx`'s `generateMetadata()`, which pulls the live store name).
- Merchant-authored HTML (package/category descriptions, CMS page content, sidebar textbox
  modules) is rendered via `dangerouslySetInnerHTML` in several places
  (`app/(store)/packages/[packageId]/page.tsx`, `.../categories/[categoryId]/page.tsx`, `.../pages/
  [slug]/page.tsx`, `components/store/sidebar-module-card.tsx`). This is intentional: that content
  is authored by the store owner in Tebex's own control panel — the same trust boundary as any
  other storefront content they control. **This is a different trust boundary than the theme
  system's admin-entered color values** (see [theming.md](./theming.md)'s validation section) —
  don't use this as precedent for skipping validation on genuinely free-text, unvalidated input.

## Sidebar modules

`components/store/sidebar-module-card.tsx` (`StoreSidebarModule`) renders `/sidebar` API modules
(top customer, recent payments, server status, payment/community goals, textbox). Unlike the admin
version (`components/admin/sidebar-module-card.tsx`), it silently omits any module type it doesn't
recognize instead of showing raw JSON — a customer shouldn't see developer diagnostics.
