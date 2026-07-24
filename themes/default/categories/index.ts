// Theme module: categories
//
// Category listing/detail presentation. `CategoriesPage` and
// `CategoryDetail` are the top-level components app/(store)/categories/**
// renders after fetching data and handling the error/not-found cases.
//
// `CategoryCard` is re-exported here for convenience but was NOT physically
// moved: it's also rendered directly by the homepage and the admin theme
// preview (app/admin/(protected)/theme/preview/storefront-preview.tsx),
// neither of which are in scope for this migration. Moving it would force
// edits to those out-of-scope call sites, so it stays in components/store/
// and is consumed from there.
export { CategoriesPage } from "./categories-page";
export { CategoryDetail } from "./category-detail";
export { CategoryCard } from "@/components/store/category-card";
