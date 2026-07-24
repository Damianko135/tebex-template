// Theme module: homepage
//
// The homepage (app/(store)/page.tsx) currently inline-renders its sections
// - hero, featured module, category grid, new arrivals, sidebar module grid
// - as JSX in the page itself rather than composing standalone components,
// so there is nothing to re-export yet.
//
// TODO(theme-migration): extract app/(store)/page.tsx's sections into
// standalone components here (e.g. Hero, FeaturedPackage, CategoryGrid,
// NewArrivals, ModuleGrid), then have the page compose them from
// "@/themes/default/homepage" instead of inlining the markup.
export {};
