import { PageHeader } from "@/components/admin/page-header";
import { storageBackend } from "@/lib/storage/storage";
import { getTheme } from "@/lib/ui/theme";

import { ThemeForm } from "./theme-form";

// Always read the live theme at request time - this is a settings page, not
// content worth prerendering, and it shouldn't require the storage backend
// (e.g. Redis) to be reachable at build time.
export const dynamic = "force-dynamic";

export default async function ThemePage() {
  const theme = await getTheme();

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Theme" }]}
        title="Storefront theme"
        description="Customize the color tokens used across the storefront, in light and dark mode."
      />
      {/* Remounts the form (resetting its in-progress draft) whenever the
          persisted theme actually changes, e.g. after a save or reset. */}
      <ThemeForm key={JSON.stringify(theme)} theme={theme} storageBackend={storageBackend} />
    </div>
  );
}
