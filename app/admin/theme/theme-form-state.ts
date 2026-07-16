export interface ThemeFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialThemeFormState: ThemeFormState = { status: "idle" };
