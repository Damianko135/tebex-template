import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorPanel } from "@/components/error-panel";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PageHeader } from "@/components/admin/page-header";
import { PropertyGrid } from "@/components/admin/property-grid";
import { EnumBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getPackage } from "@/lib/tebex/queries";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = await params;
  const result = await getPackage(packageId);

  if (!result.ok) {
    return (
      <div className="space-y-6">
        <PageHeader
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Packages", href: "/admin/packages" },
            { label: packageId },
          ]}
          title={packageId}
        />
        <ErrorPanel error={result.error} />
      </div>
    );
  }

  const pkg = result.data;
  if (!pkg) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Packages", href: "/admin/packages" },
          { label: pkg.name ?? packageId },
        ]}
        title={pkg.name ?? packageId}
        description={
          <span className="flex items-center gap-2">
            {pkg.type && <EnumBadge value={pkg.type} />}
            {pkg.total_price !== undefined && (
              <span>{formatCurrency(pkg.total_price, pkg.currency)}</span>
            )}
            {pkg.category && (
              <Link href={`/admin/categories/${pkg.category.id}`} className="hover:underline">
                in {pkg.category.name}
              </Link>
            )}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyGrid
              value={pkg}
              exclude={["description", "media", "category", "options", "variables", "creator_meta_data"]}
              columns={2}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent>
            {pkg.media && pkg.media.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {pkg.media.map((media, index) => (
                  <div key={media.url ?? `media-${index}`} className="space-y-1">
                    <Image
                      src={media.url ?? ""}
                      alt={media.name ?? ""}
                      width={120}
                      height={120}
                      unoptimized
                      className="aspect-square w-full rounded-md border border-border object-cover"
                    />
                    <div className="flex gap-1">
                      {media.primary && <EnumBadge value="primary" tone="success" />}
                      {media.featured && <EnumBadge value="featured" tone="warning" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No media.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {(pkg.options?.length || pkg.variables?.length || pkg.creator_meta_data) ? (
        <Card>
          <CardHeader>
            <CardTitle>Options, variables & metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pkg.options && pkg.options.length > 0 && (
              <PropertyGrid value={{ options: pkg.options }} columns={1} />
            )}
            {pkg.variables && pkg.variables.length > 0 && (
              <PropertyGrid value={{ variables: pkg.variables }} columns={1} />
            )}
            {pkg.creator_meta_data && (
              <PropertyGrid
                value={{ creator_meta_data: pkg.creator_meta_data }}
                columns={1}
              />
            )}
          </CardContent>
        </Card>
      ) : null}

      {pkg.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border p-4"
              dangerouslySetInnerHTML={{ __html: pkg.description }}
            />
          </CardContent>
        </Card>
      )}

      <JSONViewer data={pkg} label="Raw package" />
    </div>
  );
}
