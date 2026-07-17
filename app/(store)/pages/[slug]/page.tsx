import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { stripHtml } from "@/lib/format";
import { getCustomPages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

type CMSPageProps = { params: Promise<{ slug: string }> };

async function findVisiblePage(slug: string) {
  const result = await getCustomPages();
  if (!result.ok) return undefined;
  const page = result.data.data?.find((candidate) => candidate.slug === slug);
  return page && !page.hidden && !page.disabled ? page : undefined;
}

export async function generateMetadata({ params }: CMSPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await findVisiblePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.content ? stripHtml(page.content).slice(0, 160) : undefined,
  };
}

export default async function CMSPage({ params }: CMSPageProps) {
  const { slug } = await params;
  const page = await findVisiblePage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{page.title}</h1>
      <div
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
      />
    </div>
  );
}
