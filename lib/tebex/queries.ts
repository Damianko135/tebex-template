import "server-only";

import { getTebexClient } from "./client";
import {
  basicAuthHeader,
  tebexNotConfigured as notConfigured,
  unwrapTebexResponse as unwrap,
} from "./result";
import type { BasicAuthCredentials, OperationResponse, TebexResult } from "./result";

export type { BasicAuthCredentials, TebexResult };

export async function getWebstore(): Promise<TebexResult<OperationResponse<"getWebstore">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/"));
}

export async function getCustomPages(): Promise<TebexResult<OperationResponse<"getCustomPages">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/pages"));
}

export async function getCategories(): Promise<TebexResult<OperationResponse<"getCategories">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/categories"));
}

export async function getCategoriesWithPackages(): Promise<
  TebexResult<OperationResponse<"getCategoriesIncludePackages">>
> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/categories?includePackages=1"));
}

export async function getCategory(
  categoryId: string
): Promise<TebexResult<OperationResponse<"getCategoryIncludePackages">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.GET("/categories/{categoryId}?includePackages=1", {
      params: { path: { categoryId } },
    })
  );
}

export async function getCategoryForBasket(
  categoryId: string,
  basketIdent: string
): Promise<TebexResult<OperationResponse<"getCategoryIncludeDynamicPackages">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.GET("/categories/{categoryId}?includePackages=1&basketIdent={basketIdent}", {
      params: { path: { categoryId, basketIdent } },
    })
  );
}

/**
 * `getUserTieredCategories` is declared with `security: basicAuth` in the
 * schema but doesn't document what credentials it expects, so the caller
 * supplies whatever the store requires and it's passed straight through.
 */
export async function getUserTieredCategories(
  usernameId: number,
  credentials: BasicAuthCredentials
): Promise<TebexResult<OperationResponse<"getUserTieredCategories">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.GET("/categories?usernameId={usernameId}&includePackages=1", {
      params: { path: { usernameId } },
      headers: { Authorization: basicAuthHeader(credentials) },
    })
  );
}

export async function getAllPackages(): Promise<TebexResult<OperationResponse<"getAllPackages">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/packages"));
}

export async function getPackage(
  packageId: string
): Promise<TebexResult<OperationResponse<"getPackage">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/packages/{packageId}", { params: { path: { packageId } } }));
}

export async function getPackagesForBasket(
  basketIdent: string
): Promise<TebexResult<OperationResponse<"getPackagesForBasket">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/packages?basketIdent={basketIdent}", { params: { path: { basketIdent } } }));
}

export async function getBasket(
  basketIdent: string
): Promise<TebexResult<OperationResponse<"getBasket">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(client.GET("/baskets/{basketIdent}", { params: { path: { basketIdent } } }));
}

export async function getBasketAuthUrls(
  basketIdent: string,
  returnUrl: string
): Promise<TebexResult<OperationResponse<"getBasketAuthUrl">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.GET("/baskets/{basketIdent}/auth?returnUrl={returnUrl}", {
      params: { path: { basketIdent, returnUrl } },
    })
  );
}

// No explicit return-type annotation: `ModuleBase.data` is a bare `object`
// in the schema that each Module subtype narrows to a concrete shape, which
// makes the declared `operations["getSidebar"]` intersection type appear
// incompatible with itself once expanded. Letting TypeScript infer the
// return type from the expression sidesteps that false mismatch while
// staying just as strongly typed.
export async function getSidebarModules() {
  const client = getTebexClient();
  if (!client) return notConfigured<never>();
  // `token` is a path parameter declared on this operation but unused in the
  // literal "/sidebar" path template (the account token already lives in the
  // client's base URL) - any value satisfies the type.
  return unwrap(client.GET("/sidebar", { params: { path: { token: "unused" } } }));
}
