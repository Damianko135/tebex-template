import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="min-h-svh">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">Tebex Admin</span>
        </header>
        <div className="flex-1 space-y-6 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
