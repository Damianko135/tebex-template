import createClient from "openapi-fetch";

import type { paths } from "./api/schema.js";

export function createTebexClient(publicToken: string) {
  return createClient<paths>({
    baseUrl: `https://headless.tebex.io/api/accounts/${publicToken}`,
  });
}

export type TebexClient = ReturnType<typeof createTebexClient>;
