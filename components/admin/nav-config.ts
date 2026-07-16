import {
  Boxes,
  Code2,
  FileText,
  LayoutDashboard,
  LayoutPanelTop,
  Package,
  Palette,
  ShoppingBasket,
  Store,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Add an entry here whenever a new resource page is added under /admin — the
// sidebar renders directly from this list.
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Storefront",
    items: [
      { label: "Webstore", href: "/admin/webstore", icon: Store },
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Categories", href: "/admin/categories", icon: Boxes },
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Sidebar modules", href: "/admin/sidebar", icon: LayoutPanelTop },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Baskets", href: "/admin/baskets", icon: ShoppingBasket },
      { label: "Tiers", href: "/admin/tiers", icon: Users },
    ],
  },
  {
    label: "Developer",
    items: [
      { label: "API explorer", href: "/admin/api-explorer", icon: Code2 },
      { label: "Theme", href: "/admin/theme", icon: Palette },
    ],
  },
];
