"use server";

import { revalidatePath } from "next/cache";

import { resetTheme, setTheme } from "@/lib/ui/theme";
import type { ThemeOverrides } from "@/lib/ui/tokens";
import type { ActionState } from "@/lib/action-state";
import { hasAdminSession } from "@/lib/auth";
import { THEME_TOKEN_FIELDS } from "./theme-fields";

const NOT_SIGNED_IN: ActionState = { status: "error", message: "You must be signed in as an admin." };

export async function updateThemeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await hasAdminSession())) return NOT_SIGNED_IN;
  try {
    const light: Record<string, string> = {};
    const dark: Record<string, string> = {};

    for (const field of THEME_TOKEN_FIELDS) {
      const lightValue = formData.get(`light.${field.key}`);
      const darkValue = formData.get(`dark.${field.key}`);
      if (typeof lightValue === "string" && lightValue.trim()) {
        light[field.key] = lightValue.trim();
      }
      if (typeof darkValue === "string" && darkValue.trim()) {
        dark[field.key] = darkValue.trim();
      }
    }

    const radius = formData.get("radius");
    const overrides: ThemeOverrides = {
      ...(typeof radius === "string" && radius.trim()
        ? { radius: radius.trim() }
        : {}),
      light,
      dark,
    };

    await setTheme(overrides);
    revalidatePath("/", "layout");
    return { status: "success", message: "Theme saved." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to save theme.",
    };
  }
}

export async function resetThemeAction(
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  if (!(await hasAdminSession())) return NOT_SIGNED_IN;
  await resetTheme();
  revalidatePath("/", "layout");
  return { status: "success", message: "Theme reset to defaults." };
}
