import type { FormEvent } from "react";

/** Blocks a form's submission unless the user confirms - for destructive
 * actions (remove/delete) that otherwise fire immediately on click with no
 * recovery path. A native `confirm()` is a deliberate choice here: this is
 * an internal admin tool, not a customer-facing surface, so a browser
 * dialog is an acceptable cost for a real safety net. */
export function confirmSubmit(message: string) {
  return (event: FormEvent<HTMLFormElement>) => {
    if (!window.confirm(message)) event.preventDefault();
  };
}
