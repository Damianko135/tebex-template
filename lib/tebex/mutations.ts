import "server-only";

import { getTebexBasketClient, getTebexClient } from "./client";
import {
  basicAuthHeader,
  tebexNotConfigured as notConfigured,
  unwrapTebexResponse as unwrap,
} from "./result";
import type { BasicAuthCredentials, OperationResponse, TebexResult } from "./result";

export type { BasicAuthCredentials, TebexResult };

export interface CreateBasketInput {
  completeUrl?: string;
  cancelUrl?: string;
  custom?: Record<string, unknown>;
  completeAutoRedirect?: boolean;
}

export async function createBasket(
  input: CreateBasketInput
): Promise<TebexResult<OperationResponse<"createBasket">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets", {
      body: {
        complete_url: input.completeUrl,
        cancel_url: input.cancelUrl,
        // The upstream schema declares `custom` as a bare `object` with no
        // `additionalProperties`, so openapi-typescript narrows it to
        // `Record<string, never>` (effectively "empty object only"). The API
        // accepts arbitrary JSON here per its description, so this is a
        // deliberate escape of that overly-narrow generated type.
        custom: input.custom as Record<string, never> | undefined,
        complete_auto_redirect: input.completeAutoRedirect,
      },
    })
  );
}

export async function applyCoupon(
  basketIdent: string,
  couponCode: string
): Promise<TebexResult<{ success?: boolean; message?: string }>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets/{basketIdent}/coupons", {
      params: { path: { basketIdent } },
      body: { coupon_code: couponCode },
    })
  );
}

export async function removeCoupon(
  basketIdent: string,
  couponCode: string
): Promise<TebexResult<undefined>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets/{basketIdent}/coupons/remove", {
      params: { path: { basketIdent } },
      body: { coupon_code: couponCode },
    })
  );
}

export async function applyGiftCard(
  basketIdent: string,
  cardNumber: string
): Promise<TebexResult<{ success?: boolean; message?: string }>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets/{basketIdent}/giftcards", {
      params: { path: { basketIdent } },
      body: { card_number: cardNumber },
    })
  );
}

export async function removeGiftCard(
  basketIdent: string,
  cardNumber: string
): Promise<TebexResult<undefined>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets/{basketIdent}/giftcards/remove", {
      params: { path: { basketIdent } },
      body: { card_number: cardNumber },
    })
  );
}

export async function applyCreatorCode(
  basketIdent: string,
  creatorCode: string
): Promise<TebexResult<{ success?: boolean; message?: string }>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets/{basketIdent}/creator-codes", {
      params: { path: { basketIdent } },
      body: { creator_code: creatorCode },
    })
  );
}

export async function removeCreatorCode(basketIdent: string): Promise<TebexResult<undefined>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.POST("/baskets/{basketIdent}/creator-codes/remove", {
      params: { path: { basketIdent } },
    })
  );
}

export interface DynamicPackageInput {
  name: string;
  price: number;
  slug: string;
  description?: string;
  imageUrl?: string;
  custom?: Record<string, string>;
}

export async function createDynamicPackages(
  basketIdent: string,
  username: string,
  categoryId: number,
  packages: DynamicPackageInput[]
): Promise<TebexResult<OperationResponse<"createDynamicPackage">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.PUT("/baskets/{basketIdent}/dynamic-packages", {
      params: { path: { basketIdent } },
      body: {
        username,
        category_id: categoryId,
        packages: packages.map((pkg) => ({
          name: pkg.name,
          price: pkg.price,
          slug: pkg.slug,
          description: pkg.description,
          image_url: pkg.imageUrl,
          custom: pkg.custom,
        })),
      },
    })
  );
}

/** Adds a package to a basket via the token-less `/api/baskets` server. */
export async function addBasketPackage(
  basketIdent: string,
  packageId: string,
  quantity: number,
  dynamic?: boolean
): Promise<TebexResult<OperationResponse<"addBasketPackage">>> {
  return unwrap(
    getTebexBasketClient().POST("/{basketIdent}/packages", {
      params: { path: { basketIdent } },
      body: { package_id: packageId, quantity, dynamic },
    })
  );
}

export async function removeBasketPackage(
  basketIdent: string,
  packageId: string
): Promise<TebexResult<OperationResponse<"removeBasketPackage">>> {
  return unwrap(
    getTebexBasketClient().POST("/{basketIdent}/packages/remove", {
      params: { path: { basketIdent } },
      body: { package_id: packageId },
    })
  );
}

export async function updateBasketPackageQuantity(
  basketIdent: string,
  packageId: string,
  quantity: number
): Promise<TebexResult<undefined>> {
  return unwrap(
    getTebexBasketClient().PUT("/{basketIdent}/packages/{packageId}", {
      params: { path: { basketIdent, packageId } },
      body: { quantity },
    })
  );
}

/**
 * `updateTier` is declared with `security: basicAuth` in the schema but the
 * spec doesn't document what credentials it expects, so the caller supplies
 * whatever the store requires and it's passed straight through.
 */
export async function updateTier(
  tierId: number,
  packageId: number,
  credentials: BasicAuthCredentials
): Promise<TebexResult<OperationResponse<"updateTier">>> {
  const client = getTebexClient();
  if (!client) return notConfigured();
  return unwrap(
    client.PATCH("/tiers/{tierId}", {
      params: { path: { tierId } },
      body: { package_id: packageId },
      headers: { Authorization: basicAuthHeader(credentials) },
    })
  );
}
