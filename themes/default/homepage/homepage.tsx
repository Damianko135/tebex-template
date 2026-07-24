import { CategoryGrid } from "./category-grid";
import { FeaturedPackage } from "./featured-package";
import { Hero } from "./hero";
import { ModuleGrid } from "./module-grid";
import { NewArrivals } from "./new-arrivals";
import type { CategoriesResult, FeaturedPackageData, PackagesResult, SidebarResult, Webstore } from "./types";

/** The themed homepage. Fetching and the webstore-fetch error case live in
 * app/(store)/page.tsx; this component composes the hero and every
 * data-dependent section once the webstore itself is available. */
export function Homepage({
  webstore,
  categoriesResult,
  packagesResult,
  sidebarResult,
}: {
  webstore: Webstore;
  categoriesResult: CategoriesResult;
  packagesResult: PackagesResult;
  sidebarResult: SidebarResult;
}) {
  const categories = categoriesResult.ok ? (categoriesResult.data.data ?? []) : [];
  const topLevelCategories = categories.filter((category) => !category.parent).slice(0, 8);
  const packages = packagesResult.ok ? (packagesResult.data.data ?? []) : [];
  const newArrivals = [...packages]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 8);

  const modules = sidebarResult.ok ? (sidebarResult.data.data ?? []) : [];
  const featuredModule = modules.find((module) => module.type === "featured_package") as
    | { type: "featured_package"; data: FeaturedPackageData }
    | undefined;
  const otherModules = modules.filter((module) => module.type !== "featured_package");

  return (
    <div className="space-y-24 pb-24">
      <Hero webstore={webstore} />
      {featuredModule && <FeaturedPackage module={featuredModule.data} />}
      {topLevelCategories.length > 0 && <CategoryGrid categories={topLevelCategories} />}
      {newArrivals.length > 0 && <NewArrivals packages={newArrivals} />}
      {otherModules.length > 0 && <ModuleGrid modules={otherModules} />}
    </div>
  );
}
