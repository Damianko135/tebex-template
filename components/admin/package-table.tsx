"use client";

import Link from "next/link";
import Image from "next/image";
import type { components } from "tebex-headless";

import { formatCurrency } from "@/lib/format";

import { DataTable, type DataTableColumn } from "./data-table";
import { EnumBadge } from "./status-badge";

type Package = components["schemas"]["Package"];

/** Reused by the packages list and the category detail page. */
export function PackageTable({
  packages,
  showCategory = false,
}: {
  packages: Package[];
  showCategory?: boolean;
}) {
  const columns: DataTableColumn<Package>[] = [
    {
      id: "name",
      header: "Package",
      render: (pkg) => (
        <div className="flex items-center gap-2">
          {pkg.image ? (
            <Image
              src={pkg.image}
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-md border border-border object-cover"
              unoptimized
            />
          ) : (
            <div className="size-7 shrink-0 rounded-md border border-dashed border-border" />
          )}
          <Link href={`/admin/packages/${pkg.id}`} className="font-medium hover:underline">
            {pkg.name}
          </Link>
        </div>
      ),
      sortValue: (pkg) => pkg.name?.toLowerCase() ?? "",
    },
    ...(showCategory
      ? [
          {
            id: "category",
            header: "Category",
            render: (pkg: Package) =>
              pkg.category ? (
                <Link
                  href={`/admin/categories/${pkg.category.id}`}
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  {pkg.category.name}
                </Link>
              ) : (
                "—"
              ),
            sortValue: (pkg: Package) => pkg.category?.name?.toLowerCase() ?? "",
          } satisfies DataTableColumn<Package>,
        ]
      : []),
    {
      id: "type",
      header: "Type",
      render: (pkg) => (pkg.type ? <EnumBadge value={pkg.type} /> : "—"),
    },
    {
      id: "price",
      header: "Price",
      render: (pkg) =>
        pkg.total_price !== undefined ? formatCurrency(pkg.total_price, pkg.currency) : "—",
      sortValue: (pkg) => pkg.total_price ?? 0,
    },
    {
      id: "discount",
      header: "Discount",
      render: (pkg) => (pkg.discount ? formatCurrency(pkg.discount, pkg.currency) : "—"),
      sortValue: (pkg) => pkg.discount ?? 0,
    },
    {
      id: "order",
      header: "Order",
      render: (pkg) => pkg.order ?? "—",
      sortValue: (pkg) => pkg.order ?? 0,
    },
  ];

  return (
    <DataTable
      data={packages}
      columns={columns}
      getRowId={(pkg) => String(pkg.id)}
      searchPlaceholder="Search packages..."
      searchFn={(pkg, query) =>
        (pkg.name?.toLowerCase().includes(query) ?? false) ||
        (pkg.slug?.toLowerCase().includes(query) ?? false)
      }
      emptyTitle="No packages"
    />
  );
}
