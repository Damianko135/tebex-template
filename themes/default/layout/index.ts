// Theme module: layout
//
// Storefront chrome - header, footer, and the shell that wraps every
// app/(store) page. Fully migrated out of components/store/.
//
// Gotcha for client components: `StorefrontShell` is a server component
// with real (non-type-only) data-fetching imports that trace back to
// "next/headers". A "use client" file that imports `SiteHeader`/
// `SiteFooter` from this barrel will pull that whole chain into its client
// bundle and fail to build - import from "./site-header"/"./site-footer"
// directly instead in that situation (see
// app/admin/(protected)/theme/preview/storefront-preview.tsx for an
// example). Server components can use this barrel normally.
export { StorefrontShell } from "./storefront-shell";
export { SiteHeader } from "./site-header";
export { SiteFooter } from "./site-footer";
