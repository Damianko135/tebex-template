"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/action-state";
import { loginAction } from "@/lib/auth-actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, initialActionState);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Admin sign in</CardTitle>
        <CardDescription>Sign in to manage your Tebex-connected storefront.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {state.status === "error" && (
            <Alert variant="destructive">
              <AlertTitle>Sign in failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" type="text" autoComplete="username" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full gap-1.5" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
