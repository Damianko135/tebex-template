import type { CSSProperties } from "react";

/** Staggers a grid item's `animate-fade-up` entrance (see globals.css) by
 * its position, capped so a long grid doesn't take forever to finish
 * revealing. */
export function revealDelay(index: number, stepMs = 40, maxMs = 320): CSSProperties {
  return { animationDelay: `${Math.min(index * stepMs, maxMs)}ms` };
}
