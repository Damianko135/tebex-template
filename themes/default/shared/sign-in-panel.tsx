"use client";

import { useActionState } from "react";
import { ExternalLink, LogIn } from "lucide-react";

import { ActionFeedback } from "@/components/action-feedback";
import { Button } from "@/components/ui/button";
import { initialActionState } from "@/lib/action-state";
import { getSignInLinksAction } from "@/lib/store/actions";

interface AuthProvider {
  name?: string;
  url?: string;
}

export function SignInPanel() {
  const [state, action, isPending] = useActionState(getSignInLinksAction, initialActionState);
  const providers = state.status === "success" ? ((state.data as { data?: AuthProvider[] })?.data ?? []) : [];
  // A successful fetch that returns zero providers is a dead end, not a
  // retry-able failure - without this check it looks identical to the
  // untouched idle state, so the button just sits there clickable forever
  // with no explanation of why nothing ever happens.
  const noProvidersConfigured = state.status === "success" && providers.length === 0;

  return (
    <div className="space-y-4">
      {noProvidersConfigured ? (
        <p className="text-sm text-muted-foreground">No sign-in methods are available for this store yet.</p>
      ) : providers.length === 0 ? (
        <form action={action}>
          <Button type="submit" size="lg" disabled={isPending} className="gap-2">
            <LogIn className="size-4" />
            {isPending ? "Loading sign-in options..." : "Sign in"}
          </Button>
        </form>
      ) : (
        <div className="space-y-2">
          {providers.map((provider) => (
            <Button
              key={provider.url}
              variant="outline"
              size="lg"
              className="w-full justify-between"
              render={<a href={provider.url} />}
            >
              Continue with {provider.name}
              <ExternalLink className="size-4" />
            </Button>
          ))}
        </div>
      )}
      <ActionFeedback state={state} variant="inline" className="text-sm" />
    </div>
  );
}
