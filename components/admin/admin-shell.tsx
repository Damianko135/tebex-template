import type { ReactNode } from "react";

import { SkipLink } from "@/components/skip-link";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";

export function AdminShell({
  children,
  user,
  storeName,
}: {
  children: ReactNode;
  user: { name: string; email: string };
  storeName?: string;
}) {
  return (
    <SidebarProvider className="min-h-svh">
      <SkipLink />
      <AppSidebar user={user} storeName={storeName} />
      <SidebarInset id="main-content">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">Store Admin</span>
        </header>
        <div className="flex-1 space-y-6 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
