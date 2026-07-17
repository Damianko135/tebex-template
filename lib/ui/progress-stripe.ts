import type { CSSProperties } from "react";

/** Diagonal-stripe texture for an animated `Progress` indicator (e.g. a
 * payment/community goal bar), shared between the admin and storefront
 * sidebar-module renderers. White at low opacity overlaid on `bg-primary`
 * reads as a shine/texture regardless of the active theme's primary color,
 * the same technique as Bootstrap's `.progress-bar-striped` - not a token
 * candidate, just avoid duplicating the literal in more than one place. */
export const PROGRESS_STRIPE_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
  backgroundSize: "1rem 1rem",
};
