"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function shouldPreventClick(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("a, button, [role='button']"));
}

export function StaticPreviewSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(className, "[&_a]:cursor-default")}
      onClickCapture={(event) => {
        if (shouldPreventClick(event.target)) event.preventDefault();
      }}
      onSubmitCapture={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}
