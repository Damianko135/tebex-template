import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
