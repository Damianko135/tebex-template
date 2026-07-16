import { notFound } from "next/navigation";

import { getCustomPages } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getCustomPages();
  if (!result.ok) notFound();

  const page = result.data.data?.find((candidate) => candidate.slug === slug);
  if (!page || page.hidden || page.disabled) notFound();

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
