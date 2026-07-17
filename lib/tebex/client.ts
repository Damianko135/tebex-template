import "server-only";

import {
  createTebexBasketClient,
  createTebexClient,
  type TebexBasketClient,
  type TebexClient,
} from "tebex-headless";

const storeToken = process.env.TEBEX_STORE_TOKEN;

let client: TebexClient | null = null;
let basketClient: TebexBasketClient | null = null;

/**
 * Lazily-constructed singleton. Returns `null` when `TEBEX_STORE_TOKEN` is
 * unset so pages can render a "not configured" state instead of crashing.
 */
export function getTebexClient(): TebexClient | null {
  if (!storeToken) return null;
  if (!client) {
    client = createTebexClient(storeToken);
  }
  return client;
}

/**
 * Client scoped to the token-less `/api/baskets` server used by the
 * `Baskets`-tagged operations (add/remove/update basket packages).
 */
export function getTebexBasketClient(): TebexBasketClient {
  if (!basketClient) {
    basketClient = createTebexBasketClient();
  }
  return basketClient;
}
