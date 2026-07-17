"use server";

import { revalidatePath } from "next/cache";

import {
  addBasketPackage,
  applyCoupon,
  applyCreatorCode,
  applyGiftCard,
  removeBasketPackage,
  removeCoupon,
  removeCreatorCode,
  removeGiftCard,
  updateBasketPackageQuantity,
} from "@/lib/tebex/mutations";
import { getBasketAuthUrls } from "@/lib/tebex/queries";
import type { ActionState } from "@/lib/action-state";
import { stringField } from "@/lib/form-data";
import { getSiteOrigin } from "@/lib/site";

import { getOrCreateBasketIdent } from "./basket";

function revalidateBasket() {
  revalidatePath("/basket");
  revalidatePath("/", "layout");
}

export async function addToBasketAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const packageId = stringField(formData, "package_id");
  if (!packageId) return { status: "error", message: "Select a package to add." };
  const quantity = Number(formData.get("quantity") ?? 1) || 1;
  const dynamic = formData.get("dynamic") === "on";

  try {
    const ident = await getOrCreateBasketIdent();
    const result = await addBasketPackage(ident, packageId, quantity, dynamic);
    if (!result.ok) return { status: "error", message: result.error.message };
    revalidateBasket();
    return { status: "success", message: "Added to basket." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to add to basket." };
  }
}

export async function removeFromBasketAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const packageId = stringField(formData, "package_id");
  if (!basketIdent || !packageId) return { status: "error", message: "We couldn't find that basket item." };

  const result = await removeBasketPackage(basketIdent, packageId);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: "Removed from basket." };
}

export async function updateBasketQuantityAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const packageId = stringField(formData, "package_id");
  if (!basketIdent || !packageId) return { status: "error", message: "We couldn't find that basket item." };
  const quantity = Number(formData.get("quantity") ?? 1) || 1;

  const result = await updateBasketPackageQuantity(basketIdent, packageId, quantity);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: "Quantity updated." };
}

export async function applyCouponAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const couponCode = stringField(formData, "coupon_code");
  if (!basketIdent || !couponCode) return { status: "error", message: "Enter a coupon code." };

  const result = await applyCoupon(basketIdent, couponCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: result.data.message ?? "Coupon applied." };
}

export async function removeCouponAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const couponCode = stringField(formData, "coupon_code");
  if (!basketIdent || !couponCode) return { status: "error", message: "We couldn't find that coupon." };

  const result = await removeCoupon(basketIdent, couponCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: "Coupon removed." };
}

export async function applyGiftCardAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const cardNumber = stringField(formData, "card_number");
  if (!basketIdent || !cardNumber) return { status: "error", message: "Enter a gift card number." };

  const result = await applyGiftCard(basketIdent, cardNumber);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: result.data.message ?? "Gift card applied." };
}

export async function removeGiftCardAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const cardNumber = stringField(formData, "card_number");
  if (!basketIdent || !cardNumber) return { status: "error", message: "We couldn't find that gift card." };

  const result = await removeGiftCard(basketIdent, cardNumber);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: "Gift card removed." };
}

export async function applyCreatorCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const creatorCode = stringField(formData, "creator_code");
  if (!basketIdent || !creatorCode) return { status: "error", message: "Enter a creator code." };

  const result = await applyCreatorCode(basketIdent, creatorCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: result.data.message ?? "Creator code applied." };
}

export async function removeCreatorCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  if (!basketIdent) return { status: "error", message: "We couldn't find your basket." };

  const result = await removeCreatorCode(basketIdent);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket();
  return { status: "success", message: "Creator code removed." };
}

/** Fetches sign-in provider links for the visitor's basket, creating one
 * first if they don't have one yet - authentication is basket-scoped in
 * this API, there's no standalone account/session concept. */
export async function getSignInLinksAction(
  _prev: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const ident = await getOrCreateBasketIdent();
    const origin = await getSiteOrigin();
    const result = await getBasketAuthUrls(ident, `${origin}/account/sign-in`);
    if (!result.ok) return { status: "error", message: result.error.message };
    return { status: "success", data: result.data };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to fetch sign-in links.",
    };
  }
}
