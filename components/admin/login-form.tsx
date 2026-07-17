"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";

import { ActionFeedback } from "@/components/action-feedback";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/action-state";
import { loginAction } from "@/lib/auth-actions";

import { SectionCard } from "./section-card";

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, initialActionState);

  return (
    <SectionCard
      title="Admin sign in"
      description="Sign in to manage your Tebex-connected storefront."
      className="w-full max-w-sm"
    >
      <form action={action} className="space-y-4">
        <ActionFeedback state={state} errorTitle="Sign in failed" />
        <FormField label="Username" htmlFor="username">
          <Input id="username" name="username" type="text" autoComplete="username" required />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </FormField>
        <Button type="submit" className="w-full gap-1.5" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </SectionCard>
  );
}
