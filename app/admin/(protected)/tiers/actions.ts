"use server";

import { getUserTieredCategories } from "@/lib/tebex/queries";
import { updateTier } from "@/lib/tebex/mutations";

import type { ActionState } from "@/lib/action-state";
import { hasAdminSession } from "@/lib/auth";
import { stringField } from "@/lib/form-data";

const NOT_SIGNED_IN: ActionState = { status: "error", message: "You must be signed in as an admin." };

export async function lookupTieredCategoriesAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await hasAdminSession())) return NOT_SIGNED_IN;
  const usernameIdRaw = stringField(formData, "usernameId");
  const authUsername = stringField(formData, "auth_username");
  const authPassword = stringField(formData, "auth_password");
  if (!usernameIdRaw || !authUsername || !authPassword) {
    return { status: "error", message: "Fill in the username ID and basic auth credentials." };
  }
  const usernameId = Number(usernameIdRaw);
  if (!Number.isFinite(usernameId)) {
    return { status: "error", message: "Username ID must be a number." };
  }
  const credentials = { username: authUsername, password: authPassword };

  const result = await getUserTieredCategories(usernameId, credentials);
  if (!result.ok) return { status: "error", message: result.error.message };

  const tieredCategories = (result.data.data ?? []).filter((category) => category.tiered);
  return { status: "success", data: tieredCategories, message: `${tieredCategories.length} tiered categories found.` };
}

export async function updateTierAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await hasAdminSession())) return NOT_SIGNED_IN;
  const tierIdRaw = stringField(formData, "tierId");
  const packageIdRaw = stringField(formData, "package_id");
  const authUsername = stringField(formData, "auth_username");
  const authPassword = stringField(formData, "auth_password");
  if (!tierIdRaw || !packageIdRaw || !authUsername || !authPassword) {
    return { status: "error", message: "Fill in the tier ID, package ID, and basic auth credentials." };
  }
  const tierId = Number(tierIdRaw);
  const packageId = Number(packageIdRaw);
  if (!Number.isFinite(tierId) || !Number.isFinite(packageId)) {
    return { status: "error", message: "Tier ID and package ID must be numbers." };
  }
  const credentials = { username: authUsername, password: authPassword };

  const result = await updateTier(tierId, packageId, credentials);
  if (!result.ok) return { status: "error", message: result.error.message };
  return { status: "success", message: result.data.message ?? "Tier updated.", data: result.data };
}
