// Theme module: categories
//
// Category card used on the homepage, the categories listing, and category
// detail (for subcategories). Currently a thin re-export of its existing
// implementation in components/store/*; nothing has moved yet.
export { CategoryCard } from "@/components/store/category-card";

// TODO(theme-migration): physically move category-card.tsx from
// components/store/ into this folder, then update its call sites
// (app/(store)/page.tsx, categories/page.tsx, categories/[categoryId]/page.tsx)
// to import from "@/themes/default/categories" instead.
