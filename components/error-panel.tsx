import type { ReactNode } from "react";
import { AlertTriangle, PlugZap } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DisplayableError {
  message: string;
  name?: string;
  status?: number;
  detail?: string;
}

export function ErrorPanel({
  error,
  title,
  audience = "customer",
  action,
}: {
  error: DisplayableError;
  title?: string;
  /** "customer" (default) keeps the API's raw message/detail out of the
   * primary line - it's meant for developers reading logs, not a shopper
   * mid-purchase. "admin" surfaces it up front instead: an operator
   * diagnosing a live integration issue needs the exact API response, not a
   * friendly paraphrase. */
  audience?: "customer" | "admin";
  /** Optional retry affordance (e.g. a "Try again" link back to the same
   * page) - these are server-rendered pages, so there's otherwise no
   * recourse besides a manual browser refresh. */
  action?: ReactNode;
}) {
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

  const reference = [error.status && `HTTP ${error.status}`, error.detail ?? error.message]
    .filter(Boolean)
    .join(" — ");

  if (audience === "admin") {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>{title ?? "Something went wrong"}</AlertTitle>
        <AlertDescription>{reference}</AlertDescription>
        {action && <AlertAction>{action}</AlertAction>}
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>{title ?? "Something went wrong"}</AlertTitle>
      <AlertDescription>
        <p>We couldn&apos;t complete this request. Please try again in a moment.</p>
        {reference && <p className="mt-1 text-xs opacity-70">Reference: {reference}</p>}
      </AlertDescription>
      {action && <AlertAction>{action}</AlertAction>}
    </Alert>
  );
}
