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
import { stringField } from "@/lib/form-data";

function revalidateBasket(basketIdent: string) {
  revalidatePath(`/admin/baskets/${basketIdent}`);
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
  revalidateBasket(basketIdent);
  return { status: "success", message: result.data.message ?? "Coupon applied." };
}

export async function removeCouponAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const couponCode = stringField(formData, "coupon_code");
  if (!basketIdent || !couponCode) return { status: "error", message: "Missing coupon." };
  const result = await removeCoupon(basketIdent, couponCode);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
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
  revalidateBasket(basketIdent);
  return { status: "success", message: result.data.message ?? "Gift card applied." };
}

export async function removeGiftCardAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const cardNumber = stringField(formData, "card_number");
  if (!basketIdent || !cardNumber) return { status: "error", message: "Missing gift card." };
  const result = await removeGiftCard(basketIdent, cardNumber);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
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
  revalidateBasket(basketIdent);
  return { status: "success", message: result.data.message ?? "Creator code applied." };
}

export async function removeCreatorCodeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  if (!basketIdent) return { status: "error", message: "Missing basket." };
  const result = await removeCreatorCode(basketIdent);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Creator code removed." };
}

export async function addPackageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const packageId = stringField(formData, "package_id");
  if (!basketIdent || !packageId) return { status: "error", message: "Missing basket or package." };
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
  const basketIdent = stringField(formData, "basketIdent");
  const packageId = stringField(formData, "package_id");
  if (!basketIdent || !packageId) return { status: "error", message: "Missing basket or package." };
  const result = await removeBasketPackage(basketIdent, packageId);
  if (!result.ok) return { status: "error", message: result.error.message };
  revalidateBasket(basketIdent);
  return { status: "success", message: "Package removed from basket." };
}

export async function updateQuantityAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const basketIdent = stringField(formData, "basketIdent");
  const packageId = stringField(formData, "package_id");
  if (!basketIdent || !packageId) return { status: "error", message: "Missing basket or package." };
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
  const basketIdent = stringField(formData, "basketIdent");
  const returnUrl = stringField(formData, "returnUrl");
  if (!basketIdent || !returnUrl) return { status: "error", message: "Missing basket or return URL." };
  const result = await getBasketAuthUrls(basketIdent, returnUrl);
  if (!result.ok) return { status: "error", message: result.error.message };
  return { status: "success", data: result.data };
}
