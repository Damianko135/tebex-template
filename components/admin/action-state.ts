export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  data?: unknown;
}

export const initialActionState: ActionState = { status: "idle" };
