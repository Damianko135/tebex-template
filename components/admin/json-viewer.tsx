"use client";

import { useState } from "react";
import { ChevronRight, Copy, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium">
        <ChevronRight className={cn("size-4 shrink-0 transition-transform", open && "rotate-90")} />
        <FileJson className="size-4 text-muted-foreground" />
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="relative border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={handleCopy}
            aria-label="Copy JSON"
          >
            <Copy className="size-3.5" />
          </Button>
          {copied && (
            <span className="absolute top-2.5 right-10 text-xs text-muted-foreground">
              Copied
            </span>
          )}
          <pre className="max-h-[32rem] overflow-auto p-3 font-mono text-xs leading-relaxed">
            {json}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
