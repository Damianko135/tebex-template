export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  // destructive/success/warning each carry a `-foreground` pair, matching
  // primary/secondary/accent, so any solid-fill use (e.g. a badge sitting
  // directly on a photo, where the soft-tint convention below doesn't have
  // enough contrast) has a token-safe, theme-reactive text color instead of
  // a hardcoded white that could fail once a merchant recolors the base
  // token. The soft-tint convention used everywhere else
  // (bg-destructive/15 text-destructive, etc.) doesn't need these - the
  // token itself is already the text color there.
  destructive: string;
  "destructive-foreground": string;
  success: string;
  "success-foreground": string;
  warning: string;
  "warning-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
}

export interface Theme {
  radius: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export type ThemeOverrides = Partial<{
  radius: string;
  light: Partial<ThemeColors>;
  dark: Partial<ThemeColors>;
}>;

// Theme values are admin-entered free text that gets injected verbatim as
// CSS custom-property values into a raw <style> tag served in every page's
// <head> (see lib/ui/theme-css.ts, app/layout.tsx) - not HTML, so it isn't a
// candidate for HTML sanitization. This allowlist blocks characters that
// could terminate the property declaration or the surrounding <style>
// element (";", "<", ">", quotes, braces) while still permitting every
// legitimate CSS color notation (hex, rgb()/oklch()/etc, keywords, percent,
// alpha slashes) and length values like "0.625rem".
const SAFE_CSS_VALUE_RE = /^[\w#().,%\s/-]{1,64}$/;

export function isSafeThemeValue(value: string): boolean {
  return SAFE_CSS_VALUE_RE.test(value);
}

// Default palette for the template's out-of-the-box look (see docs/theming.md
// and .impeccable.md's Design Context): a warm paper-toned neutral base -
// tinted slightly toward the accent hue rather than clinical gray - with a
// deep, desaturated pine green as the accent. Deliberately restrained: this
// is a sensible starting point for any game-server storefront, not a strong
// standalone brand identity, since merchants re-theme via Admin -> Theme.
export const DEFAULT_THEME: Theme = {
  radius: "0.375rem",
  light: {
    background: "oklch(0.985 0.004 85)",
    foreground: "oklch(0.19 0.008 85)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.19 0.008 85)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.19 0.008 85)",
    primary: "oklch(0.34 0.06 152)",
    "primary-foreground": "oklch(0.98 0.008 152)",
    secondary: "oklch(0.95 0.006 85)",
    "secondary-foreground": "oklch(0.25 0.01 85)",
    muted: "oklch(0.95 0.006 85)",
    "muted-foreground": "oklch(0.46 0.012 85)",
    accent: "oklch(0.93 0.025 152)",
    "accent-foreground": "oklch(0.22 0.03 152)",
    destructive: "oklch(0.55 0.18 27)",
    "destructive-foreground": "oklch(0.98 0.01 27)",
    // Hue 165 (rather than primary's 152) so a success state doesn't read
    // as "more brand green" - close enough to stay unambiguously green,
    // far enough to be visually distinct from the accent.
    success: "oklch(0.53 0.14 165)",
    "success-foreground": "oklch(0.98 0.01 165)",
    warning: "oklch(0.55 0.15 80)",
    "warning-foreground": "oklch(0.98 0.01 80)",
    border: "oklch(0.9 0.006 85)",
    input: "oklch(0.9 0.006 85)",
    ring: "oklch(0.55 0.09 152)",
    "chart-1": "oklch(0.45 0.09 152)",
    "chart-2": "oklch(0.62 0.11 75)",
    "chart-3": "oklch(0.55 0.12 35)",
    "chart-4": "oklch(0.5 0.06 240)",
    "chart-5": "oklch(0.42 0.08 320)",
    sidebar: "oklch(0.97 0.005 85)",
    "sidebar-foreground": "oklch(0.19 0.008 85)",
    "sidebar-primary": "oklch(0.34 0.06 152)",
    "sidebar-primary-foreground": "oklch(0.98 0.008 152)",
    "sidebar-accent": "oklch(0.93 0.01 85)",
    "sidebar-accent-foreground": "oklch(0.22 0.01 85)",
    "sidebar-border": "oklch(0.9 0.006 85)",
    "sidebar-ring": "oklch(0.55 0.09 152)",
  },
  dark: {
    background: "oklch(0.17 0.008 85)",
    foreground: "oklch(0.96 0.004 85)",
    card: "oklch(0.21 0.008 85)",
    "card-foreground": "oklch(0.96 0.004 85)",
    popover: "oklch(0.21 0.008 85)",
    "popover-foreground": "oklch(0.96 0.004 85)",
    primary: "oklch(0.68 0.11 152)",
    "primary-foreground": "oklch(0.16 0.02 152)",
    secondary: "oklch(0.27 0.008 85)",
    "secondary-foreground": "oklch(0.92 0.006 85)",
    muted: "oklch(0.27 0.008 85)",
    "muted-foreground": "oklch(0.65 0.012 85)",
    accent: "oklch(0.28 0.03 152)",
    "accent-foreground": "oklch(0.92 0.02 152)",
    destructive: "oklch(0.62 0.18 25)",
    // Dark text, not white: at this lightness, white text on `destructive`
    // measures ~3.7:1 (fails the 4.5:1 AA-normal minimum for small text,
    // e.g. the "Sale" badge). Darkening `destructive` itself to fix that
    // would break the more widely-used `text-destructive`-on-background
    // pairing (soft-tint badges/buttons), which relies on this exact
    // lightness. Dark text at the same darkness already used for
    // success/warning/primary-foreground in dark mode clears 4.9:1 against
    // the unchanged token - the correct fix, and more consistent with the
    // adjacent tokens besides.
    "destructive-foreground": "oklch(0.16 0.02 25)",
    success: "oklch(0.68 0.15 165)",
    "success-foreground": "oklch(0.16 0.02 165)",
    warning: "oklch(0.75 0.15 80)",
    "warning-foreground": "oklch(0.16 0.02 80)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.68 0.11 152)",
    "chart-1": "oklch(0.68 0.11 152)",
    "chart-2": "oklch(0.75 0.12 75)",
    "chart-3": "oklch(0.68 0.13 35)",
    "chart-4": "oklch(0.68 0.08 240)",
    "chart-5": "oklch(0.62 0.1 320)",
    sidebar: "oklch(0.2 0.008 85)",
    "sidebar-foreground": "oklch(0.96 0.004 85)",
    "sidebar-primary": "oklch(0.68 0.11 152)",
    "sidebar-primary-foreground": "oklch(0.16 0.02 152)",
    "sidebar-accent": "oklch(0.27 0.01 85)",
    "sidebar-accent-foreground": "oklch(0.92 0.01 85)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.68 0.11 152)",
  },
};
