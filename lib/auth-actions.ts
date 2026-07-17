"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { auth } from "@/lib/auth";
import { signInSimple, signOutSimple } from "@/lib/auth-simple";
import { stringField } from "@/lib/form-data";
import { redis } from "@/lib/redis";

/** Shared by both the login page and the admin sidebar's sign-out button -
 * the only two places that need to know whether Redis (and therefore real
 * Better Auth sessions) is configured. See lib/auth-simple.ts. */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const username = stringField(formData, "username");
  const password = stringField(formData, "password");
  if (!username || !password) {
    return { status: "error", message: "Enter a username and password." };
  }

  if (redis) {
    try {
      await auth.api.signInUsername({ body: { username, password } });
    } catch {
      return { status: "error", message: "Invalid username or password." };
    }
  } else if (!(await signInSimple(username, password))) {
    return { status: "error", message: "Invalid username or password." };
  }

  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  if (redis) {
    await auth.api.signOut({ headers: await headers() });
  } else {
    await signOutSimple();
  }
  redirect("/admin/login");
}
