import type { ThemeColors } from "@/lib/ui/tokens";

export interface ThemeTokenField {
  key: keyof ThemeColors;
  label: string;
  group: "Core" | "Sidebar" | "Charts";
}

export const THEME_TOKEN_GROUPS = ["Core", "Sidebar", "Charts"] as const;

export const THEME_TOKEN_FIELDS: ThemeTokenField[] = [
  { key: "background", label: "Background", group: "Core" },
  { key: "foreground", label: "Foreground", group: "Core" },
  { key: "card", label: "Card", group: "Core" },
  { key: "card-foreground", label: "Card foreground", group: "Core" },
  { key: "popover", label: "Popover", group: "Core" },
  { key: "popover-foreground", label: "Popover foreground", group: "Core" },
  { key: "primary", label: "Primary", group: "Core" },
  { key: "primary-foreground", label: "Primary foreground", group: "Core" },
  { key: "secondary", label: "Secondary", group: "Core" },
  { key: "secondary-foreground", label: "Secondary foreground", group: "Core" },
  { key: "muted", label: "Muted", group: "Core" },
  { key: "muted-foreground", label: "Muted foreground", group: "Core" },
  { key: "accent", label: "Accent", group: "Core" },
  { key: "accent-foreground", label: "Accent foreground", group: "Core" },
  { key: "destructive", label: "Destructive", group: "Core" },
  { key: "border", label: "Border", group: "Core" },
  { key: "input", label: "Input", group: "Core" },
  { key: "ring", label: "Ring", group: "Core" },
  { key: "chart-1", label: "Chart 1", group: "Charts" },
  { key: "chart-2", label: "Chart 2", group: "Charts" },
  { key: "chart-3", label: "Chart 3", group: "Charts" },
  { key: "chart-4", label: "Chart 4", group: "Charts" },
  { key: "chart-5", label: "Chart 5", group: "Charts" },
  { key: "sidebar", label: "Sidebar", group: "Sidebar" },
  { key: "sidebar-foreground", label: "Sidebar foreground", group: "Sidebar" },
  { key: "sidebar-primary", label: "Sidebar primary", group: "Sidebar" },
  {
    key: "sidebar-primary-foreground",
    label: "Sidebar primary foreground",
    group: "Sidebar",
  },
  { key: "sidebar-accent", label: "Sidebar accent", group: "Sidebar" },
  {
    key: "sidebar-accent-foreground",
    label: "Sidebar accent foreground",
    group: "Sidebar",
  },
  { key: "sidebar-border", label: "Sidebar border", group: "Sidebar" },
  { key: "sidebar-ring", label: "Sidebar ring", group: "Sidebar" },
];
