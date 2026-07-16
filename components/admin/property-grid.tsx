import { formatDate, formatNumber, humanizeKey, looksLikeDate, looksLikeUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

import { BooleanBadge, NullableValue } from "./status-badge";

/** Renders every own property of an object as a label/value grid, recursing
 * into nested objects and arrays so no field is silently dropped. Accepts
 * `unknown` values rather than a closed JSON type because several
 * upstream schema fields (e.g. package `options`/`variables`) are declared
 * without an item/property shape, so the generated types are themselves
 * effectively untyped. */
export function PropertyGrid({
  value,
  exclude,
  columns = 2,
}: {
  value: Record<string, unknown>;
  exclude?: string[];
  columns?: 1 | 2 | 3;
}) {
  const entries = Object.entries(value).filter(([key]) => !exclude?.includes(key));

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No properties.</p>;
  }

  const columnClass = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-4", columnClass)}>
      {entries.map(([key, fieldValue]) => (
        <div key={key} className="min-w-0 space-y-1">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {humanizeKey(key)}
          </dt>
          <dd className="text-sm wrap-break-word">
            <PropertyValue value={fieldValue} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PropertyValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <NullableValue />;
  }

  if (typeof value === "boolean") {
    return <BooleanBadge value={value} />;
  }

  if (typeof value === "number") {
    return <span>{formatNumber(value)}</span>;
  }

  if (typeof value === "string") {
    if (looksLikeDate(value)) return <span>{formatDate(value)}</span>;
    if (looksLikeUrl(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {value}
        </a>
      );
    }
    return <span>{value}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <NullableValue />;
    const isPrimitiveArray = value.every((item) => item === null || typeof item !== "object");
    if (isPrimitiveArray) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <span
              key={index}
              className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs"
            >
              <PropertyValue value={item} />
            </span>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="rounded-md border border-border p-2">
            {item !== null && typeof item === "object" ? (
              <PropertyGrid value={item as Record<string, unknown>} columns={1} />
            ) : (
              <PropertyValue value={item} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Plain nested object.
  return (
    <div className="rounded-md border border-border p-2">
      <PropertyGrid value={value as Record<string, unknown>} columns={1} />
    </div>
  );
}
