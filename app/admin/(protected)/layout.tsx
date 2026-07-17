import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";
import { getSimpleSession } from "@/lib/auth-simple";
import { redis } from "@/lib/redis";
import { getWebstore } from "@/lib/tebex/queries";

// Authentication boundary for every /admin/* route except /admin/login
// (which lives outside this route group specifically so it isn't gated by
// itself). This is Better Auth (or, without REDIS_URL, lib/auth-simple.ts's
// stateless fallback) protecting our own dashboard - it has no relationship
// to Tebex customer accounts/checkout, which remain entirely under
// app/(store)/.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = redis
    ? await auth.api.getSession({ headers: await headers() })
    : await getSimpleSession();

  if (!session) {
    redirect("/admin/login");
  }

  // React.cache()-deduped (see lib/tebex/queries.ts), so this costs no
  // extra network call even though app/admin/(protected)/page.tsx also
  // fetches the webstore on the dashboard route.
  const webstoreResult = await getWebstore();
  const storeName = (webstoreResult.ok && webstoreResult.data.data?.name) || undefined;

  return (
    <AdminShell user={session.user} storeName={storeName}>
      {children}
    </AdminShell>
  );
}
