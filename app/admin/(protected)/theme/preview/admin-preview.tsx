"use client";

import {
  Activity,
  LayoutGrid,
  Package,
  Settings,
} from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { EnumBadge } from "@/components/admin/status-badge";
import { FormField } from "@/components/form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

import { PREVIEW_ADMIN_ROWS, PREVIEW_STORE_NAME, type AdminPreviewRow } from "./fixtures";
import { StaticPreviewSurface } from "./static-preview-surface";

const COLUMNS: DataTableColumn<AdminPreviewRow>[] = [
  {
    id: "package",
    header: "Package",
    render: (row) => <span className="font-medium">{row.packageName}</span>,
    sortValue: (row) => row.packageName.toLowerCase(),
  },
  {
    id: "category",
    header: "Category",
    render: (row) => row.category,
    sortValue: (row) => row.category.toLowerCase(),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <EnumBadge
        value={row.status}
        tone={row.status === "active" ? "success" : row.status === "draft" ? "warning" : "danger"}
      />
    ),
    sortValue: (row) => row.status,
  },
  {
    id: "updated",
    header: "Updated",
    render: (row) => <span className="text-muted-foreground">{row.updatedAt}</span>,
    sortValue: (row) => row.updatedAt,
  },
];

export function AdminPreview() {
  return (
    <Card className="overflow-hidden p-0">
      <StaticPreviewSurface>
        <SidebarProvider defaultOpen>
          <div className="grid min-h-120 grid-cols-1 md:grid-cols-[15rem_1fr]">
            <Sidebar collapsible="none" className="border-r border-sidebar-border">
              <SidebarHeader className="border-b border-sidebar-border">
                <div className="space-y-0.5 px-2 py-1">
                  <p className="text-sm font-semibold">{PREVIEW_STORE_NAME}</p>
                  <p className="text-xs text-sidebar-foreground/70">Admin workspace</p>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive>
                          <LayoutGrid />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Package />
                          <span>Packages</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Settings />
                          <span>Theme</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="border-t border-sidebar-border">
                <div className="flex items-center justify-between rounded-md bg-sidebar-accent px-2 py-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-sidebar-accent-foreground">
                    <span className="size-2 rounded-full ring-2 ring-sidebar-ring" />
                    Status
                  </span>
                  <Badge className="bg-sidebar-primary text-sidebar-primary-foreground">Healthy</Badge>
                </div>
              </SidebarFooter>
            </Sidebar>

            <div className="space-y-4 bg-background p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-heading text-lg tracking-tight">Packages</p>
                  <p className="text-sm text-muted-foreground">Manage listing visibility and pricing.</p>
                </div>
                <Button type="button" className="gap-1.5">
                  <Activity className="size-4" />
                  Publish changes
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick edit form</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <FormField label="Package title" htmlFor="preview-package-title" className="sm:col-span-1">
                    <Input id="preview-package-title" value="Legend Rank" readOnly />
                  </FormField>
                  <FormField label="Price" htmlFor="preview-package-price" className="sm:col-span-1">
                    <Input id="preview-package-price" value="24.99" readOnly />
                  </FormField>
                  <FormField label="Description" htmlFor="preview-package-description" className="sm:col-span-2">
                    <Textarea id="preview-package-description" value="Includes daily rewards, private channel access, and exclusive cosmetics." readOnly />
                  </FormField>
                </CardContent>
              </Card>

              <DataTable
                data={PREVIEW_ADMIN_ROWS}
                columns={COLUMNS}
                getRowId={(row) => row.id}
                searchPlaceholder="Search packages..."
                searchFn={(row, query) =>
                  row.packageName.toLowerCase().includes(query) || row.category.toLowerCase().includes(query)
                }
                emptyTitle="No packages"
              />
            </div>
          </div>
        </SidebarProvider>
      </StaticPreviewSurface>
    </Card>
  );
}
