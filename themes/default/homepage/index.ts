// Theme module: homepage
//
// The storefront landing page. `Homepage` composes the hero, the
// featured-package banner, the category grid, new arrivals, and the
// remaining /sidebar module grid directly - those sections were previously
// split into one file each, but every one had exactly one caller
// (`Homepage` itself) and no reason (e.g. a client-component boundary) to
// stay separate, so they were folded back in for a single cohesive file.
// `SectionHeader` (reused by two sections) and `StoreSidebarModule` (a
// substantial polymorphic renderer, not a "tiny" component) remain split
// out since both have a real reason to.
//
// app/(store)/page.tsx only fetches data, handles the webstore-fetch error
// case, and renders `Homepage`.
export { Homepage } from "./homepage";
export { SectionHeader } from "./section-header";
export { StoreSidebarModule } from "./sidebar-module-card";
