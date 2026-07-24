import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { stripHtml } from "@/lib/format";
import { getPackage } from "@/lib/tebex/queries";
import { PackageDetail } from "@/themes/default/packages";
import { StorePage } from "@/themes/default/shared";

export const dynamic = "force-dynamic";

type PackagePageProps = { params: Promise<{ packageId: string }> };

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { packageId } = await params;
  const result = await getPackage(packageId);
  const pkg = result.ok ? result.data : undefined;
  if (!pkg) return {};
  return {
    title: pkg.name,
    description: pkg.description ? stripHtml(pkg.description).slice(0, 160) : undefined,
    openGraph: pkg.image ? { images: [pkg.image] } : undefined,
  };
}

export default async function Page({ params }: PackagePageProps) {
  const { packageId } = await params;
  const result = await getPackage(packageId);
  if (!result.ok) {
    return (
      <StorePage>
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href={`/packages/${packageId}`} />}>
              Try again
            </Button>
          }
        />
      </StorePage>
    );
  }

  const pkg = result.data;
  if (!pkg) notFound();

  return <PackageDetail pkg={pkg} />;
}
