"use server";

import { redirect } from "next/navigation";

import { createBasket } from "@/lib/tebex/mutations";
import { getBasket } from "@/lib/tebex/queries";

import { type ActionState } from "@/lib/action-state";
import { hasAdminSession } from "@/lib/auth";
import { stringField } from "@/lib/form-data";

const NOT_SIGNED_IN: ActionState = { status: "error", message: "You must be signed in as an admin." };

export async function createBasketAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await hasAdminSession())) return NOT_SIGNED_IN;
  const customRaw = stringField(formData, "custom");
  let custom: Record<string, unknown> | undefined;
  if (customRaw) {
    try {
      custom = JSON.parse(customRaw);
    } catch {
      return { status: "error", message: "Custom data must be valid JSON." };
    }
  }

  const result = await createBasket({
    completeUrl: stringField(formData, "complete_url"),
    cancelUrl: stringField(formData, "cancel_url"),
    completeAutoRedirect: formData.get("complete_auto_redirect") === "on",
    custom,
  });

  if (!result.ok) {
    return { status: "error", message: result.error.message };
  }

  const ident = result.data.data?.ident;
  if (!ident) {
    return { status: "error", message: "Basket was created but no identifier was returned." };
  }

  redirect(`/admin/baskets/${ident}`);
}

export async function lookupBasketAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await hasAdminSession())) return NOT_SIGNED_IN;
  const ident = stringField(formData, "basketIdent");
  if (!ident) {
    return { status: "error", message: "Enter a basket identifier." };
  }

  const result = await getBasket(ident);
  if (!result.ok) {
    return { status: "error", message: result.error.message };
  }

  redirect(`/admin/baskets/${ident}`);
}
