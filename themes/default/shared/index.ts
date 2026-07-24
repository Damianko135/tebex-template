// Theme module: shared
//
// Presentational primitives reused across multiple storefront sections:
// page wrapper/heading, section headers, the breadcrumb trail, trust-signal
// copy, the public /sidebar module renderer, and the sign-in panel.
// Currently thin re-exports of their existing implementation in
// components/store/*; nothing has moved yet.
export { StorePage } from "@/components/store/page-container";
export { PageHeading } from "@/components/store/page-heading";
export { SectionHeader } from "@/components/store/section-header";
export { StoreBreadcrumb, type StoreCrumb } from "@/components/store/store-breadcrumb";
export { TrustSignals } from "@/components/store/trust-signals";
export { StoreSidebarModule } from "@/components/store/sidebar-module-card";
export { SignInPanel } from "@/components/store/sign-in-panel";

// TODO(theme-migration): physically move these files from components/store/
// into this folder once their call sites import from
// "@/themes/default/shared" instead.
