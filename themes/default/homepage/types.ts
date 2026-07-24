import type { getAllPackages, getCategoriesWithPackages, getSidebarModules, getWebstore } from "@/lib/tebex/queries";

export type WebstoreResult = Awaited<ReturnType<typeof getWebstore>>;
export type Webstore = Extract<WebstoreResult, { ok: true }>["data"]["data"];

export type CategoriesResult = Awaited<ReturnType<typeof getCategoriesWithPackages>>;
export type Category = NonNullable<Extract<CategoriesResult, { ok: true }>["data"]["data"]>[number];

export type PackagesResult = Awaited<ReturnType<typeof getAllPackages>>;
export type Package = NonNullable<Extract<PackagesResult, { ok: true }>["data"]["data"]>[number];

export type SidebarResult = Awaited<ReturnType<typeof getSidebarModules>>;
export type SidebarModule = NonNullable<Extract<SidebarResult, { ok: true }>["data"]["data"]>[number];

export type FeaturedPackageData = { header: string; package: Package };
