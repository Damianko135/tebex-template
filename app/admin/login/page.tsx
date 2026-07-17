import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/lib/auth";
import { getSimpleSession } from "@/lib/auth-simple";
import { redis } from "@/lib/redis";

export default async function AdminLoginPage() {
  const session = redis
    ? await auth.api.getSession({ headers: await headers() })
    : await getSimpleSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
