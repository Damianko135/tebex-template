import { storageBackend } from "@/lib/storage/storage";
import { getTheme } from "@/lib/ui/theme";

import { ThemeForm } from "./theme-form";

// Always read the live theme at request time - this is a settings page, not
// content worth prerendering, and it shouldn't require the storage backend
// (e.g. Redis) to be reachable at build time.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const theme = await getTheme();

  return (
    // Remounts the form (resetting its in-progress draft) whenever the
    // persisted theme actually changes, e.g. after a save or reset.
    <ThemeForm
      key={JSON.stringify(theme)}
      theme={theme}
      storageBackend={storageBackend}
    />
  );
}
