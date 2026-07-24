import type { components } from "tebex-headless";

type Category = components["schemas"]["Category"];
type CMSPage = components["schemas"]["CMSPage"];
type Package = components["schemas"]["Package"];

export interface AdminPreviewRow {
  id: string;
  packageName: string;
  category: string;
  status: "active" | "draft" | "disabled";
  updatedAt: string;
}

export const PREVIEW_STORE_NAME = "Aurora Craft";

export const PREVIEW_CATEGORIES: Category[] = [
  {
    id: 101,
    name: "Ranks",
    slug: "ranks",
    packages: [{ id: 1 }, { id: 2 }, { id: 3 }],
  } as Category,
  {
    id: 102,
    name: "Crates",
    slug: "crates",
    packages: [{ id: 4 }, { id: 5 }],
  } as Category,
  {
    id: 103,
    name: "Perks",
    slug: "perks",
    packages: [{ id: 6 }],
  } as Category,
];

export const PREVIEW_PAGES: CMSPage[] = [
  {
    id: 201,
    title: "Support",
    slug: "support",
    hidden: false,
    disabled: false,
  } as CMSPage,
  {
    id: 202,
    title: "How it works",
    slug: "how-it-works",
    hidden: false,
    disabled: false,
  } as CMSPage,
];

export const PREVIEW_ADMIN_ROWS: AdminPreviewRow[] = [
  {
    id: "pkg-1",
    packageName: "Legend Rank",
    category: "Ranks",
    status: "active",
    updatedAt: "2m ago",
  },
  {
    id: "pkg-2",
    packageName: "Summer Crate",
    category: "Crates",
    status: "draft",
    updatedAt: "14m ago",
  },
  {
    id: "pkg-3",
    packageName: "VIP Chat Perk",
    category: "Perks",
    status: "disabled",
    updatedAt: "1h ago",
  },
];

export const PREVIEW_PACKAGES: Package[] = [
  {
    id: 301,
    name: "Legend Rank",
    slug: "legend-rank",
    type: "subscription",
    category: { id: 101, name: "Ranks" },
    total_price: 24.99,
    base_price: 29.99,
    discount: 5,
    currency: "USD",
  } as Package,
  {
    id: 302,
    name: "Summer Crate",
    slug: "summer-crate",
    type: "single",
    category: { id: 102, name: "Crates" },
    total_price: 14.99,
    currency: "USD",
  } as Package,
  {
    id: 303,
    name: "Builder Perk",
    slug: "builder-perk",
    type: "single",
    category: { id: 103, name: "Perks" },
    total_price: 9.99,
    currency: "USD",
  } as Package,
];

export const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const;
