import "server-only";

import { headers } from "next/headers";

/** Resolves the site's public origin, for building absolute URLs (e.g. the
 * `complete_url`/`cancel_url` a basket redirects back to after checkout). */
export async function getSiteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
