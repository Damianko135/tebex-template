# Theming

The storefront's color theme is server-side, KV-backed, and editable from the admin dashboard
without a rebuild — a store owner can rebrand the site by changing color values in `/admin/theme`.

## Storage: single global theme, KV-backed

`lib/storage/storage.ts` wraps [unstorage](https://unstorage.unjs.io) with its Redis driver
(`REDIS_URL`) or, if unset, its in-memory driver — the same graceful-fallback approach used for
admin auth (see [authentication.md](./authentication.md)). There is one theme for the whole
deployment (`theme:active` key) — not per-visitor, not multi-tenant.

## Shape: a token object, not raw CSS

`lib/ui/tokens.ts` defines:

- `ThemeColors` — every CSS custom property name the Tailwind/shadcn setup uses
  (`background`, `foreground`, `card`, `primary`, `sidebar-*`, `chart-*`, ...).
- `Theme = { radius: string; light: ThemeColors; dark: ThemeColors }`.
- `ThemeOverrides` — the same shape, but every field optional (what's actually persisted — only
  what differs from the built-in `DEFAULT_THEME`).

## Read/write layer: `lib/ui/theme.ts`

- `getTheme()` — reads the stored `ThemeOverrides` and merges over `DEFAULT_THEME`. **Wrapped in a
  try/catch that falls back to `DEFAULT_THEME` on any storage error.** This matters because every
  single page calls this unconditionally via the root layout (below) — a transient Redis blip must
  not take the entire site down for what's ultimately a cosmetic feature.
- `setTheme(overrides)` — merges the given overrides over whatever's already stored (so saving the
  light-mode colors doesn't clobber dark-mode ones), validates every value (below), then persists.
- `resetTheme()` — deletes the stored overrides entirely, reverting to `DEFAULT_THEME`.
- `getThemeStyle()` — `getTheme()` then `themeToCSS()` (`lib/ui/theme-css.ts`), producing a
  ready-to-inject CSS string: `:root { --background: ...; }` / `.dark { --background: ...; }`.

## Injection: the root layout, not client-side

`app/layout.tsx` is an `async` Server Component. It calls `getThemeStyle()` and injects the result
as `<style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeStyle }} />` in `<head>`, so the
client receives fully-themed HTML on first paint — no client-side fetch, no flash of unstyled
content. `lib/ui/globals.css` deliberately does **not** define `--background`/`--primary`/etc.
itself; it only maps Tailwind's `@theme inline` color tokens to those CSS variable names, with a
comment pointing back here.

Follow this same layering if you extend theming (more token categories, per-tenant themes, etc.):
keep `lib/storage/` a generic KV wrapper, `lib/ui/theme.ts` the theme-specific merge/validate/
serialize logic, and inject via the root layout — never client-side.

## Validation: why free-text color input is safe here

The admin theme editor (`app/admin/(protected)/theme/theme-form.tsx`) is literal free-text input —
a color picker for convenience, but the underlying `<Input>` accepts anything. Because the stored
value is injected **verbatim as raw CSS** into a `<style>` tag served on every page to every
visitor, an unvalidated value like `</style><script>...` would be a site-wide stored XSS, not a
"self" XSS limited to the admin's own session.

`lib/ui/tokens.ts` exports `isSafeThemeValue()` — a character-allowlist regex
(`^[\w#().,%\s/-]{1,64}$`) that permits every legitimate CSS color notation (hex, `rgb()`/`oklch()`
/etc, named keywords, percentages, alpha slashes) and length values (`0.625rem`), while rejecting
anything that could terminate the CSS property declaration or break out of the `<style>` element
(`;`, `<`, `>`, quotes, braces). `lib/ui/theme.ts`'s `setTheme()` calls this on every field via
`assertSafeOverrides()` and throws before anything unsafe is persisted — the admin form's
`updateThemeAction` catches that and surfaces it as a normal inline error message.

Any new theme field added in the future automatically goes through this same validator as long as
it's written via `setTheme()` — don't bypass it with a direct `storage.setItem()` call.

## The admin editor

`app/admin/(protected)/theme/theme-form.tsx` is a two-pane client component: a form on the left
(`react-color-palette` for the color picker UI), a live preview on the right that scopes the
in-progress draft's CSS variables to itself via inline `style` (the same technique shadcn/ui's own
theme customizer uses) — so the preview updates instantly without touching the real persisted
theme or the rest of the page.
