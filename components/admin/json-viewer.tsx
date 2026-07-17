"use client";

import { useState } from "react";
import { ChevronRight, Copy, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function JSONViewer({
  data,
  defaultOpen = false,
  label = "Raw JSON",
}: {
  data: unknown;
  defaultOpen?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  async function handleCopy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50">
        <ChevronRight className={cn("size-4 shrink-0 transition-transform", open && "rotate-90")} />
        <FileJson className="size-4 text-muted-foreground" />
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="relative border-t border-border">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                  aria-label="Copy JSON"
                />
              }
            >
              <Copy className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied" : "Copy JSON"}</TooltipContent>
          </Tooltip>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Copied to clipboard." : ""}
          </span>
          <pre className="max-h-128 overflow-auto p-3 font-mono text-xs leading-relaxed">
            {json}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
