import type { Theme, ThemeColors } from "./tokens";

export function themeVarsToCSSText(
  vars: Partial<ThemeColors> & { radius?: string }
): string {
  return Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

export function themeToCSS(theme: Theme): string {
  return [
    `:root {\n${themeVarsToCSSText({ ...theme.light, radius: theme.radius })}\n}`,
    `.dark {\n${themeVarsToCSSText(theme.dark)}\n}`,
  ].join("\n\n");
}
