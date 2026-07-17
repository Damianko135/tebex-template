/** Visually hidden until focused, then jumps a keyboard user straight past
 * the header/nav to `#main-content` - without this, every page load
 * requires tabbing through the full header (logo, nav, search, cart,
 * mobile menu trigger) before reaching any actual content. Must be the
 * first focusable element in the shell for `href` to matter as a skip
 * target rather than just another link.
 * See https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground ring-1 ring-ring focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </a>
  );
}
