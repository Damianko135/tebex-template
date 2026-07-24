// Theme module: packages
//
// Package listing/detail presentation. `PackagesPage` and `PackageDetail`
// are the top-level components app/(store)/packages/** renders after
// fetching data and handling the error/not-found cases; `PackageBrowser`,
// `PackageGallery`, and `PackageDetailSkeleton` are their supporting
// pieces. All fully migrated out of components/store/.
//
// `PackageCard` and `AddToBasketForm` are re-exported here for convenience
// but were NOT physically moved: `PackageCard` is also rendered directly by
// the homepage, the category detail page, and the admin theme preview, and
// `AddToBasketForm` is also rendered directly by the homepage - none of
// which are in scope for this migration. Moving either file would force
// edits to those out-of-scope call sites, so they stay in components/store/
// and are consumed from there.
export { PackagesPage } from "./packages-page";
export { PackageDetail } from "./package-detail";
export { PackageDetailSkeleton } from "./package-detail-skeleton";
export { PackageBrowser } from "./package-browser";
export { PackageGallery } from "./package-gallery";
export { PackageCard } from "@/components/store/package-card";
export { AddToBasketForm } from "@/components/store/add-to-basket-form";
