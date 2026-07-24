// Theme module: layout
//
// Storefront chrome - header, footer, and the shell that wraps every
// app/(store) page. Currently thin re-exports of their existing
// implementation in components/store/*; nothing has moved yet.
export { SiteHeader } from "@/components/store/site-header";
export { SiteFooter } from "@/components/store/site-footer";
export { StorefrontShell } from "@/components/store/storefront-shell";

// TODO(theme-migration): physically move site-header.tsx, site-footer.tsx,
// and storefront-shell.tsx from components/store/ into this folder, then
// update their call sites (app/(store)/layout.tsx and each other) to import
// from "@/themes/default/layout" instead.
