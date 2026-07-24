// Theme module: packages
//
// Package listing/detail presentation - the card, the searchable/sortable
// browser grid, the detail-page image gallery, and the add-to-basket form
// (used from package cards, package detail, and the homepage). Currently
// thin re-exports of their existing implementation in components/store/*;
// nothing has moved yet.
export { PackageCard } from "@/components/store/package-card";
export { PackageBrowser } from "@/components/store/package-browser";
export { PackageGallery } from "@/components/store/package-gallery";
export { AddToBasketForm } from "@/components/store/add-to-basket-form";

// TODO(theme-migration): physically move package-card.tsx,
// package-browser.tsx, package-gallery.tsx, and add-to-basket-form.tsx from
// components/store/ into this folder, then update their call sites
// (app/(store)/page.tsx, packages/page.tsx, packages/[packageId]/page.tsx,
// categories/[categoryId]/page.tsx, search/page.tsx) to import from
// "@/themes/default/packages" instead.
