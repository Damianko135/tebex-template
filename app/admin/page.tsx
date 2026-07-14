import { storageBackend } from "@/lib/storage/storage";
import { getTheme } from "@/lib/ui/theme";

import { ThemeForm } from "./theme-form";

export default async function AdminPage() {
  const theme = await getTheme();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Manage global settings for this storefront.
        </p>
      </div>
      <ThemeForm theme={theme} storageBackend={storageBackend} />
    </div>
  );
}
