import type { ReactNode } from "react";

import { getCurrentBasket } from "@/lib/store/basket";
import { getCategories, getCustomPages, getWebstore } from "@/lib/tebex/queries";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function StorefrontShell({ children }: { children: ReactNode }) {
  const [webstoreResult, categoriesResult, pagesResult, basket] = await Promise.all([
    getWebstore(),
    getCategories(),
    getCustomPages(),
    getCurrentBasket(),
  ]);

  const storeName = (webstoreResult.ok && webstoreResult.data.data?.name) || "Store";
  const logo = webstoreResult.ok ? webstoreResult.data.data?.logo : undefined;
  const currency = webstoreResult.ok ? webstoreResult.data.data?.currency : undefined;
  const topLevelCategories = categoriesResult.ok
    ? (categoriesResult.data.data ?? []).filter((category) => !category.parent)
    : [];
  const pages = pagesResult.ok
    ? (pagesResult.data.data ?? []).filter((page) => !page.hidden && !page.disabled)
    : [];
  const cartCount =
    basket?.packages?.reduce((sum, pkg) => sum + (pkg.in_basket?.quantity ?? 0), 0) ?? 0;

  return (
    <div className="flex min-h-svh flex-col">
      {!webstoreResult.ok && (
        <div className="bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-700 dark:text-amber-400">
          This store isn&apos;t connected yet — set <code className="font-mono">TEBEX_STORE_TOKEN</code>{" "}
          to show live data.
        </div>
      )}
      <SiteHeader
        storeName={storeName}
        logo={logo}
        categories={topLevelCategories}
        pages={pages}
        cartCount={cartCount}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter storeName={storeName} currency={currency} pages={pages} />
    </div>
  );
}
