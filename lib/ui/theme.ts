import { storage } from "@/lib/storage/storage";
import { themeToCSS } from "./theme-css";
import { DEFAULT_THEME, isSafeThemeValue, type Theme, type ThemeOverrides } from "./tokens";

const THEME_KEY = "theme:active";

function mergeTheme(overrides: ThemeOverrides | null): Theme {
  return {
    radius: overrides?.radius ?? DEFAULT_THEME.radius,
    light: { ...DEFAULT_THEME.light, ...overrides?.light },
    dark: { ...DEFAULT_THEME.dark, ...overrides?.dark },
  };
}

/** Rejects theme values that can't be trusted as raw CSS - they're injected
 * verbatim into a <style> tag (see lib/ui/theme-css.ts), so anything let
 * through here is a potential site-wide CSS/HTML injection. */
function assertSafeOverrides(overrides: ThemeOverrides): void {
  const invalidKeys: string[] = [];
  if (overrides.radius !== undefined && !isSafeThemeValue(overrides.radius)) {
    invalidKeys.push("radius");
  }
  for (const mode of ["light", "dark"] as const) {
    for (const [key, value] of Object.entries(overrides[mode] ?? {})) {
      if (typeof value === "string" && !isSafeThemeValue(value)) {
        invalidKeys.push(`${mode}.${key}`);
      }
    }
  }
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid theme value(s): ${invalidKeys.join(", ")}`);
  }
}

export async function getTheme(): Promise<Theme> {
  try {
    const overrides = await storage.getItem<ThemeOverrides>(THEME_KEY);
    return mergeTheme(overrides);
  } catch (error) {
    // Every page reads the theme unconditionally via app/layout.tsx, so a
    // storage outage here must not take down the whole site - fall back to
    // defaults instead of throwing, the same graceful-degradation approach
    // already used when REDIS_URL is unset entirely (see storage.ts).
    console.error("[theme] Failed to read the stored theme, falling back to defaults.", error);
    return DEFAULT_THEME;
  }
}

export async function setTheme(overrides: ThemeOverrides): Promise<Theme> {
  assertSafeOverrides(overrides);
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

export async function getThemeStyle(): Promise<string> {
  return themeToCSS(await getTheme());
}
