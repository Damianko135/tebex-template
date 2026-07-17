import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Session } from "@/lib/auth";

import { AppSidebar } from "./app-sidebar";

export function AdminShell({
  children,
  session,
}: {
  children: ReactNode;
  session: Session;
}) {
  return (
    <SidebarProvider className="min-h-svh">
      <AppSidebar user={session.user} />
      <SidebarInset>
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
