import type { Metadata } from "next";
import type { ReactNode } from "react";

// Sibling to app/admin/login/ and app/admin/(protected)/ - exists purely to
// give both a shared title template (route groups are transparent to the
// URL but not to metadata/layout nesting).
export const metadata: Metadata = {
  title: { default: "Store Admin", template: "%s | Store Admin" },
  description: "Manage your Tebex-powered storefront.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
