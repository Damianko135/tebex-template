// Theme entrypoint: "default"
//
// Goal: a theme author should eventually be able to do all their
// visual/layout work inside themes/<theme-name>/ alone. Business logic
// (data fetching, server actions, auth, formatting, storage) stays in lib/
// and is consumed by these components via props/imports - it is never
// reimplemented here. Reusable, unstyled primitives (button, card, dialog,
// etc.) stay in components/ui/ and are shared across every theme.
//
// Each submodule below currently re-exports the existing implementation
// from components/store/* unchanged (see each folder's index.ts for the
// per-file TODOs). No files have moved and no imports elsewhere in the app
// have changed - this file only establishes a single, stable import surface
// for the theme going forward: `@/themes/default`.
export * as layout from "./layout";
export * as basket from "./basket";
export * as packages from "./packages";
export * as categories from "./categories";
export * as homepage from "./homepage";
export * as pages from "./pages";
export * as shared from "./shared";
