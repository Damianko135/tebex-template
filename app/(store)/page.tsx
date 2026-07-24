import { ErrorPanel } from "@/components/error-panel";
import { getAllPackages, getCategoriesWithPackages, getSidebarModules, getWebstore } from "@/lib/tebex/queries";
import { Homepage } from "@/themes/default/homepage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [webstoreResult, categoriesResult, packagesResult, sidebarResult] = await Promise.all([
    getWebstore(),
    getCategoriesWithPackages(),
    getAllPackages(),
    getSidebarModules(),
  ]);

  if (!webstoreResult.ok) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <ErrorPanel error={webstoreResult.error} />
      </div>
    );
  }

  return (
    <Homepage
      webstore={webstoreResult.data.data}
      categoriesResult={categoriesResult}
      packagesResult={packagesResult}
      sidebarResult={sidebarResult}
    />
  );
}
