import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { stripHtml } from "@/lib/format";
import { getCustomPages } from "@/lib/tebex/queries";
import { CMSPage } from "@/themes/default/pages";

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

export default async function Page({ params }: CMSPageProps) {
  const { slug } = await params;
  const page = await findVisiblePage(slug);
  if (!page) notFound();

  return <CMSPage page={page} />;
}
