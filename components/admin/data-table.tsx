"use client";

import { type ReactNode, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";

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
import { cn } from "@/lib/utils";

import { EmptyState } from "./empty-state";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchPlaceholder = "Search...",
  searchFn,
  emptyTitle = "No results",
  emptyDescription,
  onRowClick,
}: {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  searchFn?: (row: T, query: string) => boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[1]);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFn) return data;
    return data.filter((row) => searchFn(row, query.trim().toLowerCase()));
  }, [data, query, searchFn]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((candidate) => candidate.id === sort.id);
    if (!column?.sortValue) return filtered;
    const withKeys = filtered.map((row) => ({ row, key: column.sortValue!(row) }));
    withKeys.sort((a, b) => {
      if (a.key < b.key) return sort.dir === "asc" ? -1 : 1;
      if (a.key > b.key) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return withKeys.map((entry) => entry.row);
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  function toggleSort(columnId: string) {
    setSort((prev) => {
      if (prev?.id !== columnId) return { id: columnId, dir: "asc" };
      if (prev.dir === "asc") return { id: columnId, dir: "desc" };
      return null;
    });
  }

  return (
    <div className="space-y-3">
      {searchFn && (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.id} className={column.className}>
                      {column.sortValue ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.id)}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {column.header}
                          {sort?.id === column.id ? (
                            sort.dir === "asc" ? (
                              <ArrowUp className="size-3.5" />
                            ) : (
                              <ArrowDown className="size-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="size-3.5 text-muted-foreground/50" />
                          )}
                        </button>
                      ) : (
                        column.header
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} className={column.className}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              {sorted.length} {sorted.length === 1 ? "row" : "rows"}
              {sorted.length !== data.length ? ` (filtered from ${data.length})` : ""}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    size="xs"
                    variant={size === pageSize ? "secondary" : "ghost"}
                    onClick={() => {
                      setPageSize(size);
                      setPage(0);
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage + 1} of {pageCount}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
