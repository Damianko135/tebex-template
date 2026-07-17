"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { EndpointManifestEntry } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
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

import { EmptyState } from "@/components/empty-state";
import { JSONViewer } from "./json-viewer";

// HTTP-method color coding (GET blue, POST green, PUT/PATCH amber, DELETE
// red) is a convention borrowed from tools like Postman/Swagger, not a
// themeable brand or semantic-state color - every entry is a fixed Tailwind
// palette color, not a theme token, so this scheme reads the same
// regardless of what a merchant sets destructive/success/warning to.
const METHOD_TONE: Record<string, string> = {
  GET: "border-transparent bg-sky-500/15 text-sky-600 dark:text-sky-400",
  POST: "border-transparent bg-green-500/15 text-green-600 dark:text-green-400",
  PUT: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  PATCH: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  DELETE: "border-transparent bg-red-500/15 text-red-600 dark:text-red-400",
};

function MethodBadge({ method }: { method: string }) {
  return (
    <Badge variant="outline" className={cn("w-16 justify-center font-mono text-xs", METHOD_TONE[method])}>
      {method}
    </Badge>
  );
}

export function ApiExplorer({ endpoints }: { endpoints: EndpointManifestEntry[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(endpoints[0]?.operationId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return endpoints;
    return endpoints.filter(
      (endpoint) =>
        endpoint.path.toLowerCase().includes(q) ||
        endpoint.operationId.toLowerCase().includes(q) ||
        endpoint.summary?.toLowerCase().includes(q)
    );
  }, [endpoints, query]);

  const selected = endpoints.find((endpoint) => endpoint.operationId === selectedId) ?? filtered[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[22rem_1fr]">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search endpoints..."
            aria-label="Search endpoints"
            className="pl-8"
          />
        </div>
        <div className="max-h-[70svh] space-y-1 overflow-auto rounded-lg border border-border p-1.5">
          {filtered.length === 0 ? (
            <EmptyState title="No matching endpoints" className="border-none py-8" />
          ) : (
            filtered.map((endpoint) => (
              <button
                key={endpoint.operationId}
                type="button"
                onClick={() => setSelectedId(endpoint.operationId)}
                className={cn(
                  "flex w-full flex-col gap-1 rounded-md px-2.5 py-2 text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  selected?.operationId === endpoint.operationId && "bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <MethodBadge method={endpoint.method} />
                  <span className="truncate font-mono text-xs text-muted-foreground">{endpoint.path}</span>
                </div>
                <span className="truncate font-medium">{endpoint.summary ?? endpoint.operationId}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {selected && (
        <div className="space-y-4 rounded-lg border border-border p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <MethodBadge method={selected.method} />
              <code className="font-mono text-sm">{selected.path}</code>
              {selected.requiresAuth && <Badge variant="outline">Requires auth</Badge>}
            </div>
            <h2 className="text-lg font-semibold">{selected.summary ?? selected.operationId}</h2>
            {selected.description && (
              <p className="text-sm whitespace-pre-line text-muted-foreground">{selected.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Operation ID: </span>
              <code className="font-mono">{selected.operationId}</code>
            </div>
            <div>
              <span className="text-muted-foreground">Tags: </span>
              {selected.tags.join(", ") || "—"}
            </div>
            {selected.requestSchema && (
              <div>
                <span className="text-muted-foreground">Request schema: </span>
                <code className="font-mono">{selected.requestSchema}</code>
              </div>
            )}
            {selected.responseSchema && (
              <div>
                <span className="text-muted-foreground">Response schema: </span>
                <code className="font-mono">{selected.responseSchema}</code>
              </div>
            )}
          </div>

          {selected.parameters.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Parameters</h3>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>In</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.parameters.map((param) => (
                      <TableRow key={param.name}>
                        <TableCell className="font-mono">{param.name}</TableCell>
                        <TableCell>{param.location}</TableCell>
                        <TableCell>{param.type ?? "—"}</TableCell>
                        <TableCell>{param.required ? "Yes" : "No"}</TableCell>
                        <TableCell className="whitespace-normal text-muted-foreground">
                          {param.description ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {selected.successDescription && (
            <div>
              <h3 className="mb-1 text-sm font-medium">Success response</h3>
              <p className="text-sm text-muted-foreground">{selected.successDescription}</p>
            </div>
          )}

          <JSONViewer data={selected} label="Raw manifest entry" />
        </div>
      )}
    </div>
  );
}
