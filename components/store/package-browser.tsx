"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { components } from "tebex-headless";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";

import { PackageCard } from "./package-card";

type Package = components["schemas"]["Package"];

export function PackageBrowser({
  packages,
  initialQuery = "",
}: {
  packages: Package[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState<number | "all">("all");

  const categories = useMemo(() => {
    const map = new Map<number, string>();
    for (const pkg of packages) {
      if (pkg.category?.id && pkg.category.name) map.set(pkg.category.id, pkg.category.name);
    }
    return [...map.entries()];
  }, [packages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages.filter((pkg) => {
      const matchesQuery =
        !q ||
        pkg.name?.toLowerCase().includes(q) ||
        pkg.description?.toLowerCase().includes(q) ||
        pkg.slug?.toLowerCase().includes(q);
      const matchesCategory = categoryId === "all" || pkg.category?.id === categoryId;
      return matchesQuery && matchesCategory;
    });
  }, [packages, query, categoryId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search packages..."
            className="pl-8"
          />
        </div>
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={categoryId === "all" ? "secondary" : "ghost"}
              onClick={() => setCategoryId("all")}
            >
              All
            </Button>
            {categories.map(([id, name]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={categoryId === id ? "secondary" : "ghost"}
                onClick={() => setCategoryId(id)}
              >
                {name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No packages found" description="Try a different search or filter." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
