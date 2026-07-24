import type { components } from "tebex-headless";

type CMSPageData = components["schemas"]["CMSPage"];

/** The themed CMS page. Fetching, visibility filtering, and the not-found
 * case live in app/(store)/pages/[slug]/page.tsx; this component renders
 * the page itself once a visible page has been resolved. */
export function CMSPage({ page }: { page: CMSPageData }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl tracking-tight">{page.title}</h1>
      <div
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
      />
    </div>
  );
}
