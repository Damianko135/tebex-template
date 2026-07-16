import createClient from "openapi-fetch";

import type { paths } from "./api/schema";

export function createTebexClient(publicToken: string) {
  return createClient<paths>({
    baseUrl: `https://headless.tebex.io/api/accounts/${publicToken}`,
  });
}

export type TebexClient = ReturnType<typeof createTebexClient>;

/**
 * The `Baskets` tagged operations (add/remove/update basket packages) are
 * declared in the schema with their own `servers` override
 * (`/api/baskets`, no account token) instead of the default
 * `/api/accounts/{token}` base used by every other operation. openapi-fetch
 * only supports a single base URL per client, so a second client scoped to
 * that server is needed to call them with correct URLs.
 */
export function createTebexBasketClient() {
  return createClient<paths>({
    baseUrl: "https://headless.tebex.io/api/baskets",
  });
}

export type TebexBasketClient = ReturnType<typeof createTebexBasketClient>;
