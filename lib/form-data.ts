/** Reads a form field as a trimmed string, or `undefined` if it's missing,
 * not a string, or blank. Used by every Server Action that parses a plain
 * `FormData` (basket mutations, admin lookup/update forms) so a missing
 * required field is always a normal `{ status: "error" }` result rather
 * than an uncaught exception. */
export function stringField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
