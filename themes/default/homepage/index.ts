// Theme module: homepage
//
// The storefront landing page, fully migrated. `Homepage` composes the
// hero, the featured-package banner, the category grid, new arrivals, and
// the remaining /sidebar module grid. app/(store)/page.tsx only fetches
// data, handles the webstore-fetch error case, and renders `Homepage`.
export { Homepage } from "./homepage";
export { Hero } from "./hero";
export { FeaturedPackage } from "./featured-package";
export { CategoryGrid } from "./category-grid";
export { NewArrivals } from "./new-arrivals";
export { ModuleGrid } from "./module-grid";
export { SectionHeader } from "./section-header";
export { StoreSidebarModule } from "./sidebar-module-card";
