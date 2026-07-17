# Embedded checkout

`app/(store)/basket/page.tsx`'s "Proceed to checkout" is powered by
[`@tebexio/tebex.js`](https://github.com/tebexio/Tebex.js), Tebex's official client-side
checkout-embed widget, wrapped by `components/store/checkout-link.tsx` (`CheckoutLink`).

## What Tebex.js is (and isn't)

Tebex.js renders Tebex's checkout UI as a popup/lightbox on your page, so a customer never leaves
your site to pay. It is **not** a data API — it doesn't know about categories, packages, or
baskets. It only needs one thing: a checkout `ident`, which it treats as an opaque capability
token (like a Stripe Checkout Session ID). Tebex's servers already know everything about that
transaction from when the ident was created; Tebex.js just renders a UI for it.

This app's `ident` comes from the Headless API's `createBasket()` (`lib/store/basket.ts` →
`lib/tebex/mutations.ts`) — the same basket this app already builds up via add-to-basket/coupon/
gift-card actions. See [tebex-integration.md](./tebex-integration.md) for why this app uses the
Headless API rather than the separate Checkout API (which has its own, unrelated way of minting an
ident, authenticated with a Project ID + Private Key this app doesn't use).

## `CheckoutLink`: progressive enhancement, not a replacement

`basket.links.checkout` (a link to Tebex's own hosted checkout page) was always the working
fallback. `CheckoutLink` keeps rendering that as a real `<a href>` and layers the popup on top:

```tsx
<Button
  render={
    <a href={href} onClick={handleClick} />
  }
>
  Proceed to checkout
</Button>
```

`handleClick`:

1. Bails out immediately (letting the native link navigation proceed) if there's no `basketIdent`
   or a launch is already in progress.
2. Otherwise calls `event.preventDefault()` and dynamically `import()`s `@tebexio/tebex.js` —
   **never** a static/top-level import, so the widget's JS is not part of any page's initial
   bundle and only loads when a visitor actually clicks checkout.
3. `Tebex.checkout.init({ ident: basketIdent, theme: "auto", closeOnClickOutside: true, closeOnEsc: true, closeOnPaymentComplete: true })`, subscribes to events (below), then `Tebex.checkout.launch()`.
4. If the dynamic import or launch throws (ad/tracker blockers do sometimes block payment
   iframes), the `catch` block manually navigates to `href` — the customer still reaches a working
   checkout either way.

## Events

| Event | What this app does |
| --- | --- |
| `payment:complete` | `router.push("/checkout/success")` — an in-app redirect for a smooth handoff. |
| `close` | Resets the button back to its idle state (user dismissed the popup without paying). |
| `payment:error` | Shows an inline "payment could not be processed" message under the button. |

**This app never treats `payment:complete` as proof of payment.** Tebex.js's own docs are explicit
that its client-side events must not substitute for webhook verification. This is safe here
specifically because `app/(store)/checkout/success/page.tsx` already re-reads the basket fresh
from the Headless API (`getCurrentBasket()`) rather than trusting anything the client claims — that
was true before Tebex.js was added and hasn't changed.

## Extending this pattern

If a future "buy now" / instant-checkout entry point is added somewhere other than the basket page
(e.g. skipping straight from a package detail page), reuse `CheckoutLink` rather than duplicating
the dynamic-import/event-wiring logic — don't add Tebex.js to other components speculatively.
