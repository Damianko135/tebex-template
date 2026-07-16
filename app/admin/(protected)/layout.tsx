import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";

// Authentication boundary for every /admin/* route except /admin/login
// (which lives outside this route group specifically so it isn't gated by
// itself). This is Better Auth protecting our own dashboard - it has no
// relationship to Tebex customer accounts/checkout, which remain entirely
// under app/(store)/.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
