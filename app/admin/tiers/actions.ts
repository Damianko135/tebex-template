"use server";

import { getUserTieredCategories } from "@/lib/tebex/queries";
import { updateTier } from "@/lib/tebex/mutations";

import type { ActionState } from "@/lib/action-state";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required field: ${key}`);
  }
  return value.trim();
}

export async function lookupTieredCategoriesAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const usernameId = Number(requireString(formData, "usernameId"));
  if (!Number.isFinite(usernameId)) {
    return { status: "error", message: "Username ID must be a number." };
  }
  const credentials = {
    username: requireString(formData, "auth_username"),
    password: requireString(formData, "auth_password"),
  };

  const result = await getUserTieredCategories(usernameId, credentials);
  if (!result.ok) return { status: "error", message: result.error.message };

  const tieredCategories = (result.data.data ?? []).filter((category) => category.tiered);
  return { status: "success", data: tieredCategories, message: `${tieredCategories.length} tiered categories found.` };
}

export async function updateTierAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const tierId = Number(requireString(formData, "tierId"));
  const packageId = Number(requireString(formData, "package_id"));
  if (!Number.isFinite(tierId) || !Number.isFinite(packageId)) {
    return { status: "error", message: "Tier ID and package ID must be numbers." };
  }
  const credentials = {
    username: requireString(formData, "auth_username"),
    password: requireString(formData, "auth_password"),
  };

  const result = await updateTier(tierId, packageId, credentials);
  if (!result.ok) return { status: "error", message: result.error.message };
  return { status: "success", message: result.data.message ?? "Tier updated.", data: result.data };
}
