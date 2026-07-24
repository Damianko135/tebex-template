// Theme module: basket
//
// `BasketPage` composes the basket line items, discount forms, order
// summary/checkout CTA, and the empty-basket state in one file - the two
// used to be split into `empty-basket.tsx`/`checkout-summary.tsx`, but both
// had exactly one caller (`BasketPage` itself) and no client-boundary
// reason to stay separate, so they were folded back in. `BasketPackages`,
// `BasketDiscounts`, and `CheckoutLink` remain split out since each is a
// substantial "use client" component with real internal state.
//
// app/(store)/basket/page.tsx only fetches data, handles the error case,
// and renders `BasketPage`. app/(store)/basket/loading.tsx renders
// `BasketSkeleton`.
export { BasketPage } from "./basket-page";
export { BasketSkeleton } from "./basket-skeleton";
export { BasketPackages } from "./basket-packages";
export { BasketDiscounts } from "./basket-discounts";
export { CheckoutLink } from "./checkout-link";
