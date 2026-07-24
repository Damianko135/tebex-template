import type { ReactNode } from "react";

import { SkipLink } from "@/components/skip-link";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { getCurrentBasket } from "@/lib/store/basket";
import { getCategories, getCustomPages, getWebstore } from "@/lib/tebex/queries";

export async function StorefrontShell({ children }: { children: ReactNode }) {
  const [webstoreResult, categoriesResult, pagesResult, basketResult] = await Promise.all([
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
  // A failed basket fetch degrades to "0" here rather than an error banner -
  // this is just the header's cart badge, not a claim about the basket's
  // actual contents (see app/(store)/basket/page.tsx, which does surface
  // the failure explicitly since it's the page making that claim).
  const cartCount = basketResult.ok
    ? (basketResult.data?.packages?.reduce((sum, pkg) => sum + (pkg.in_basket?.quantity ?? 0), 0) ?? 0)
    : 0;

  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      {!webstoreResult.ok && (
        <div className="bg-warning/15 px-4 py-2 text-center text-xs text-warning">
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
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter storeName={storeName} currency={currency} pages={pages} />
    </div>
  );
}
