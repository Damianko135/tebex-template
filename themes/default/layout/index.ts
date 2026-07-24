// Theme module: layout
//
// Storefront chrome - header, footer, and the shell that wraps every
// app/(store) page. `StorefrontShell` is fully migrated out of
// components/store/.
//
// `SiteHeader` and `SiteFooter` are re-exported here for convenience but
// were NOT physically moved: they're also rendered directly by the admin
// theme preview (app/admin/(protected)/theme/preview/storefront-preview.tsx),
// which is out of scope for this migration. Moving them would force edits
// to that out-of-scope call site, so they stay in components/store/ and
// are consumed from there.
export { StorefrontShell } from "./storefront-shell";
export { SiteHeader } from "@/components/store/site-header";
export { SiteFooter } from "@/components/store/site-footer";
