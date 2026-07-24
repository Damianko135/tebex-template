// Theme module: shared
//
// Presentational primitives reused across multiple storefront features:
// page wrapper/heading, the breadcrumb trail, trust-signal copy, and the
// sign-in panel. Currently thin re-exports of their existing implementation
// in components/store/*; nothing has moved yet.
//
// `SectionHeader` and `StoreSidebarModule` used to be re-exported here too,
// but their only caller turned out to be the homepage - they've since moved
// to themes/default/homepage/ in full (see that module's index.ts).
export { StorePage } from "@/components/store/page-container";
export { PageHeading } from "@/components/store/page-heading";
export { StoreBreadcrumb, type StoreCrumb } from "@/components/store/store-breadcrumb";
export { TrustSignals } from "@/components/store/trust-signals";
export { SignInPanel } from "@/components/store/sign-in-panel";

// TODO(theme-migration): physically move these files from components/store/
// into this folder once their call sites import from
// "@/themes/default/shared" instead.
