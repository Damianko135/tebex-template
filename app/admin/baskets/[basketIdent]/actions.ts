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

import { type ActionState } from "@/lib/action-state";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required field: ${key}`);
  }
  return value.trim();
}

function revalidateBasket(basketIdent: string) {
  revalidatePath(`/admin/baskets/${basketIdent}`);
}

export async function applyCouponAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const couponCode = requireString(formData, "coupon_code");
  const result = await applyCoupon(basketIdent, couponCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: result.data.message ?? "Coupon applied." };
}

export async function removeCouponAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const couponCode = requireString(formData, "coupon_code");
  const result = await removeCoupon(basketIdent, couponCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Coupon removed." };
}

export async function applyGiftCardAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const cardNumber = requireString(formData, "card_number");
  const result = await applyGiftCard(basketIdent, cardNumber);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: result.data.message ?? "Gift card applied." };
}

export async function removeGiftCardAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const cardNumber = requireString(formData, "card_number");
  const result = await removeGiftCard(basketIdent, cardNumber);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Gift card removed." };
}

export async function applyCreatorCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const creatorCode = requireString(formData, "creator_code");
  const result = await applyCreatorCode(basketIdent, creatorCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: result.data.message ?? "Creator code applied." };
}

export async function removeCreatorCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const result = await removeCreatorCode(basketIdent);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Creator code removed." };
}

export async function addPackageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const packageId = requireString(formData, "package_id");
  const quantity = Number(formData.get("quantity") ?? 1) || 1;
  const dynamic = formData.get("dynamic") === "on";
  const result = await addBasketPackage(basketIdent, packageId, quantity, dynamic);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Package added to basket." };
}

export async function removePackageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const packageId = requireString(formData, "package_id");
  const result = await removeBasketPackage(basketIdent, packageId);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Package removed from basket." };
}

export async function updateQuantityAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const packageId = requireString(formData, "package_id");
  const quantity = Number(formData.get("quantity") ?? 1) || 1;
  const result = await updateBasketPackageQuantity(basketIdent, packageId, quantity);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Quantity updated." };
}

export async function getAuthUrlsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = requireString(formData, "basketIdent");
  const returnUrl = requireString(formData, "returnUrl");
  const result = await getBasketAuthUrls(basketIdent, returnUrl);
  if (!result.ok) return { status: "error", message: result.error.message };
  return { status: "success", data: result.data };
}
