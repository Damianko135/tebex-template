import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

/**
 * Client for the admin-only Better Auth instance (`lib/auth.ts`). Only used
 * by `/admin/*` pages - the storefront authenticates customers through Tebex
 * instead (see `components/store/sign-in-panel.tsx`).
 */
export const authClient = createAuthClient({
  plugins: [usernameClient()],
});

export const { signIn, signOut, useSession } = authClient;
