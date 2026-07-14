import { storage } from "@/lib/storage/storage";
import { DEFAULT_THEME, type Theme, type ThemeColors, type ThemeOverrides } from "./tokens";

const THEME_KEY = "theme:active";

function mergeTheme(overrides: ThemeOverrides | null): Theme {
  return {
    radius: overrides?.radius ?? DEFAULT_THEME.radius,
    light: { ...DEFAULT_THEME.light, ...overrides?.light },
    dark: { ...DEFAULT_THEME.dark, ...overrides?.dark },
  };
}

export async function getTheme(): Promise<Theme> {
  const overrides = await storage.getItem<ThemeOverrides>(THEME_KEY);
  return mergeTheme(overrides);
}

export async function setTheme(overrides: ThemeOverrides): Promise<Theme> {
  const existing = await storage.getItem<ThemeOverrides>(THEME_KEY);
  const merged: ThemeOverrides = {
    radius: overrides.radius ?? existing?.radius,
    light: { ...existing?.light, ...overrides.light },
    dark: { ...existing?.dark, ...overrides.dark },
  };
  await storage.setItem(THEME_KEY, merged);
  return mergeTheme(merged);
}

export async function resetTheme(): Promise<Theme> {
  await storage.removeItem(THEME_KEY);
  return DEFAULT_THEME;
}

function toCSSVars(tokens: Partial<ThemeColors> & { radius?: string }): string {
  return Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

export async function getThemeStyle(): Promise<string> {
  const theme = await getTheme();
  return [
    `:root {\n${toCSSVars({ ...theme.light, radius: theme.radius })}\n}`,
    `.dark {\n${toCSSVars(theme.dark)}\n}`,
  ].join("\n\n");
}
