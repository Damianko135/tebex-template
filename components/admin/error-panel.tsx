import { AlertTriangle, PlugZap } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DisplayableError {
  message: string;
  name?: string;
  status?: number;
  detail?: string;
}

export function ErrorPanel({ error, title }: { error: DisplayableError; title?: string }) {
  const isNotConfigured = error.name === "TebexNotConfiguredError";

  if (isNotConfigured) {
    return (
      <Alert>
        <PlugZap />
        <AlertTitle>Store not connected</AlertTitle>
        <AlertDescription>
          Set the <code className="rounded bg-muted px-1 py-0.5 font-mono">TEBEX_STORE_TOKEN</code>{" "}
          environment variable to your webstore&apos;s public token to enable live data. See{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">.env.example</code> for reference.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>{title ?? "Something went wrong"}</AlertTitle>
      <AlertDescription>
        {error.message}
        {error.status && ` (HTTP ${error.status})`}
        {error.detail && error.detail !== error.message ? ` — ${error.detail}` : ""}
      </AlertDescription>
    </Alert>
  );
}
