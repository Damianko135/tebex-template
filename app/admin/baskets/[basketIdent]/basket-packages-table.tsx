"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import type { components } from "tebex-headless";

import { EmptyState } from "@/components/empty-state";
import { EnumBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";

import { initialActionState } from "@/lib/action-state";
import { removePackageAction, updateQuantityAction } from "./actions";

type BasketPackage = components["schemas"]["BasketPackage"];

function PackageRow({ basketIdent, pkg, currency }: { basketIdent: string; pkg: BasketPackage; currency?: string }) {
  const [removeState, removeAction, removing] = useActionState(
    removePackageAction,
    initialActionState
  );
  const [updateState, updateAction, updating] = useActionState(
    updateQuantityAction,
    initialActionState
  );

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-normal">{pkg.name}</TableCell>
      <TableCell>{pkg.type ? <EnumBadge value={pkg.type} /> : "—"}</TableCell>
      <TableCell>
        <form action={updateAction} className="flex items-center gap-1.5">
          <input type="hidden" name="basketIdent" value={basketIdent} />
          <input type="hidden" name="package_id" value={String(pkg.id)} />
          <Input
            type="number"
            name="quantity"
            min={1}
            defaultValue={pkg.in_basket?.quantity ?? 1}
            className="h-7 w-16"
          />
          <Button type="submit" size="xs" variant="outline" disabled={updating}>
            {updating ? "..." : "Set"}
          </Button>
        </form>
        {updateState.status === "error" && (
          <p className="mt-1 text-xs text-destructive">{updateState.message}</p>
        )}
      </TableCell>
      <TableCell>
        {pkg.in_basket?.price !== undefined ? formatCurrency(pkg.in_basket.price, currency) : "—"}
      </TableCell>
      <TableCell>
        <form action={removeAction}>
          <input type="hidden" name="basketIdent" value={basketIdent} />
          <input type="hidden" name="package_id" value={String(pkg.id)} />
          <Button type="submit" size="icon-sm" variant="ghost" disabled={removing} aria-label={`Remove ${pkg.name}`}>
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </form>
        {removeState.status === "error" && (
          <p className="mt-1 text-xs text-destructive">{removeState.message}</p>
        )}
      </TableCell>
    </TableRow>
  );
}

export function BasketPackagesTable({
  basketIdent,
  packages,
  currency,
}: {
  basketIdent: string;
  packages: BasketPackage[];
  currency?: string;
}) {
  if (packages.length === 0) {
    return <EmptyState title="No packages in this basket" description="Add one using the form below." />;
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <PackageRow key={pkg.id} basketIdent={basketIdent} pkg={pkg} currency={currency} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
