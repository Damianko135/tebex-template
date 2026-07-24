"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import type { components } from "tebex-headless";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyState } from "@/components/empty-state";

import { PackageCard } from "./package-card";

type Package = components["schemas"]["Package"];

const PAGE_SIZE = 24;

const SORT_OPTIONS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A to Z",
  newest: "Newest",
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

export function PackageBrowser({
  packages,
  initialQuery = "",
}: {
  packages: Package[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const map = new Map<number, string>();
    for (const pkg of packages) {
      if (pkg.category?.id && pkg.category.name) map.set(pkg.category.id, pkg.category.name);
    }
    return [...map.entries()];
  }, [packages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = packages.filter((pkg) => {
      const matchesQuery =
        !q ||
        pkg.name?.toLowerCase().includes(q) ||
        pkg.description?.toLowerCase().includes(q) ||
        pkg.slug?.toLowerCase().includes(q);
      const matchesCategory = categoryId === "all" || pkg.category?.id === categoryId;
      return matchesQuery && matchesCategory;
    });

    switch (sort) {
      case "price-asc":
        return [...matches].sort((a, b) => (a.total_price ?? 0) - (b.total_price ?? 0));
      case "price-desc":
        return [...matches].sort((a, b) => (b.total_price ?? 0) - (a.total_price ?? 0));
      case "name":
        return [...matches].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      case "newest":
        return [...matches].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
      default:
        return matches;
    }
  }, [packages, query, categoryId, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search packages..."
            aria-label="Search packages"
            className="pl-8"
          />
        </div>
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={categoryId === "all" ? "secondary" : "ghost"}
              onClick={() => {
                setCategoryId("all");
                setPage(1);
              }}
            >
              All
            </Button>
            {categories.map(([id, name]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={categoryId === id ? "secondary" : "ghost"}
                onClick={() => {
                  setCategoryId(id);
                  setPage(1);
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" variant="outline" size="sm" className="gap-1.5 sm:ml-auto" />}
          >
            <ArrowUpDown className="size-3.5" />
            {SORT_OPTIONS[sort]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => {
                setSort(value as SortKey);
                setPage(1);
              }}
            >
              {(Object.entries(SORT_OPTIONS) as [SortKey, string][]).map(([key, label]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No packages found" description="Try a different search or filter." />
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-5">
            {paged.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          {pageCount > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm text-muted-foreground">
                    Page {currentPage} of {pageCount}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((p) => Math.min(pageCount, p + 1));
                    }}
                    aria-disabled={currentPage === pageCount}
                    className={currentPage === pageCount ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
