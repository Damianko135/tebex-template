import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export interface ActionFeedbackState {
  status: "idle" | "success" | "error";
  message?: string;
}

/** Renders a `useActionState` result as feedback. `variant="alert"` (the
 * default) shows a full shadcn Alert; `variant="inline"` shows only a
 * compact error line, for tight spaces like inline coupon/gift-card forms
 * where a full alert box would be too heavy. */
export function ActionFeedback({
  state,
  variant = "alert",
  className,
  successTitle = "Success",
  errorTitle = "Something went wrong",
}: {
  state: ActionFeedbackState;
  variant?: "alert" | "inline";
  className?: string;
  successTitle?: string;
  errorTitle?: string;
}) {
  if (variant === "inline") {
    if (state.status !== "error") return null;
    // `role="alert"` gives this the same automatic screen-reader
    // announcement the full `Alert` variant gets for free via
    // components/ui/alert.tsx - without it, an error surfaced through this
    // compact variant (basket quantity/remove, coupon forms, sign-in) is
    // silent to anyone not visually scanning the page for it.
    return (
      <p role="alert" className={cn("text-xs text-destructive", className)}>
        {state.message}
      </p>
    );
  }

  if (state.status === "idle") return null;
  return (
    <Alert variant={state.status === "error" ? "destructive" : "default"} className={className}>
      <AlertTitle>{state.status === "error" ? errorTitle : successTitle}</AlertTitle>
      {state.message && <AlertDescription>{state.message}</AlertDescription>}
    </Alert>
  );
}
