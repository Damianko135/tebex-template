import { notFound } from "next/navigation";

import { ErrorPanel } from "@/components/error-panel";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PageHeader } from "@/components/admin/page-header";
import { PropertyGrid } from "@/components/admin/property-grid";
import { SectionCard } from "@/components/admin/section-card";
import { getCustomPages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function PageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, result] = await Promise.all([params, getCustomPages()]);

  if (!result.ok) {
    return (
      <div className="space-y-6">
        <PageHeader
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Pages", href: "/admin/pages" },
            { label: slug },
          ]}
          title={slug}
        />
        <ErrorPanel error={result.error} audience="admin" />
      </div>
    );
  }

  const page = result.data.data?.find((candidate) => candidate.slug === slug);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pages", href: "/admin/pages" },
          { label: page.title ?? slug },
        ]}
        title={page.title ?? slug}
        description={`/${page.slug}`}
      />

      <SectionCard title="Properties">
        <PropertyGrid value={page} exclude={["content"]} columns={3} />
      </SectionCard>

      <SectionCard title="Rendered content">
        <div
          className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border p-4"
          // Page content is authored by the store owner in the Tebex control
          // panel (the same trust boundary as the storefront that renders it).
          dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
        />
      </SectionCard>

      <JSONViewer data={page} label="Raw page" />
    </div>
  );
}
