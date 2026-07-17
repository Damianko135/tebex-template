import "server-only";

import { cache } from "react";
import type { components } from "tebex-headless";

import { getTebexClient } from "./client";
import {
  basicAuthHeader,
  tebexNotConfigured as notConfigured,
  unwrapSingle,
  unwrapTebexResponse as unwrap,
} from "./result";
import type { BasicAuthCredentials, OperationResponse, TebexResult } from "./result";

export type { BasicAuthCredentials, TebexResult };

type Category = components["schemas"]["Category"];
type Package = components["schemas"]["Package"];

// Every query below is wrapped in React's `cache()`, so multiple calls with
// the same arguments within a single render (e.g. `generateMetadata` and
// the page component both fetching the same package, or the root layout
// and a page both fetching the webstore) dedupe into one actual request
// instead of racing two independent fetches - which also closes a
// resilience gap: two unmemoized calls can independently succeed/fail,
// producing a page where e.g. the header renders normally but the body
// shows an error for what was really the same underlying failure.

export const getWebstore = cache(
  async (): Promise<TebexResult<OperationResponse<"getWebstore">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/"));
  }
);

export const getCustomPages = cache(
  async (): Promise<TebexResult<OperationResponse<"getCustomPages">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/pages"));
  }
);

export const getCategories = cache(
  async (): Promise<TebexResult<OperationResponse<"getCategories">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/categories"));
  }
);

export const getCategoriesWithPackages = cache(
  async (): Promise<TebexResult<OperationResponse<"getCategoriesIncludePackages">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/categories?includePackages=1"));
  }
);

/**
 * The generated `CategoryResponse` schema (shared with the list endpoints)
 * types `data` as `Category[]`, but this single-category lookup's live
 * response wraps one `Category` object instead - verified directly against
 * the real API, not just the spec (see docs/tebex-integration.md). Normalized
 * here, once, so every caller gets a plain `Category | undefined` and never
 * needs to know about the mismatch.
 */
export const getCategory = cache(
  async (categoryId: string): Promise<TebexResult<Category | undefined>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    const result = await unwrap<{ data?: Category | Category[] }>(
      client.GET("/categories/{categoryId}?includePackages=1", {
        params: { path: { categoryId } },
      })
    );
    if (!result.ok) return result;
    return { ok: true, data: unwrapSingle(result.data.data) };
  }
);

export const getCategoryForBasket = cache(
  async (
    categoryId: string,
    basketIdent: string
  ): Promise<TebexResult<OperationResponse<"getCategoryIncludeDynamicPackages">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(
      client.GET("/categories/{categoryId}?includePackages=1&basketIdent={basketIdent}", {
        params: { path: { categoryId, basketIdent } },
      })
    );
  }
);

/**
 * `getUserTieredCategories` is declared with `security: basicAuth` in the
 * schema but doesn't document what credentials it expects, so the caller
 * supplies whatever the store requires and it's passed straight through.
 */
export const getUserTieredCategories = cache(
  async (
    usernameId: number,
    credentials: BasicAuthCredentials
  ): Promise<TebexResult<OperationResponse<"getUserTieredCategories">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(
      client.GET("/categories?usernameId={usernameId}&includePackages=1", {
        params: { path: { usernameId } },
        headers: { Authorization: basicAuthHeader(credentials) },
      })
    );
  }
);

export const getAllPackages = cache(
  async (): Promise<TebexResult<OperationResponse<"getAllPackages">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/packages"));
  }
);

/** Same generated-schema/live-API mismatch as `getCategory` above, for the
 * single-package lookup - normalized here rather than at every call site. */
export const getPackage = cache(
  async (packageId: string): Promise<TebexResult<Package | undefined>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    const result = await unwrap<{ data?: Package | Package[] }>(
      client.GET("/packages/{packageId}", { params: { path: { packageId } } })
    );
    if (!result.ok) return result;
    return { ok: true, data: unwrapSingle(result.data.data) };
  }
);

export const getPackagesForBasket = cache(
  async (basketIdent: string): Promise<TebexResult<OperationResponse<"getPackagesForBasket">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/packages?basketIdent={basketIdent}", { params: { path: { basketIdent } } }));
  }
);

export const getBasket = cache(
  async (basketIdent: string): Promise<TebexResult<OperationResponse<"getBasket">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(client.GET("/baskets/{basketIdent}", { params: { path: { basketIdent } } }));
  }
);

export const getBasketAuthUrls = cache(
  async (
    basketIdent: string,
    returnUrl: string
  ): Promise<TebexResult<OperationResponse<"getBasketAuthUrl">>> => {
    const client = getTebexClient();
    if (!client) return notConfigured();
    return unwrap(
      client.GET("/baskets/{basketIdent}/auth?returnUrl={returnUrl}", {
        params: { path: { basketIdent, returnUrl } },
      })
    );
  }
);

// No explicit return-type annotation: `ModuleBase.data` is a bare `object`
// in the schema that each Module subtype narrows to a concrete shape, which
// makes the declared `operations["getSidebar"]` intersection type appear
// incompatible with itself once expanded. Letting TypeScript infer the
// return type from the expression sidesteps that false mismatch while
// staying just as strongly typed.
export const getSidebarModules = cache(async () => {
  const client = getTebexClient();
  if (!client) return notConfigured<never>();
  // `token` is a path parameter declared on this operation but unused in the
  // literal "/sidebar" path template (the account token already lives in the
  // client's base URL) - any value satisfies the type.
  return unwrap(client.GET("/sidebar", { params: { path: { token: "unused" } } }));
});
