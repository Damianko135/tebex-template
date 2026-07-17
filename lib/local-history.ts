const MAX_ITEMS = 5;

/** Small localStorage-backed "recently used" list - e.g. basket identifiers
 * looked up in the admin, where the Headless API has no list endpoint so
 * the admin is the only place these values are ever recorded. Never store
 * secrets here (see BASIC_AUTH_USERNAME_KEY usage - username only, never a
 * password). */
export function getRecentItems(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecentItem(key: string, value: string) {
  if (typeof window === "undefined" || !value) return;
  const next = [value, ...getRecentItems(key).filter((item) => item !== value)].slice(0, MAX_ITEMS);
  window.localStorage.setItem(key, JSON.stringify(next));
}
