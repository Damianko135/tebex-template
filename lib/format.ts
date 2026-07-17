const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}:\d{2})/;

export function looksLikeDate(value: string): boolean {
  return ISO_DATE_RE.test(value);
}

// Intl formatter construction (locale-data lookup) isn't free, and these are
// called per-row across tables/lists - hoisted so it happens once per
// process instead of once per call. Locale is always `undefined` (runtime
// default), so a single shared instance is correct here.
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const NUMBER_FORMAT = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
// Currency varies per call (a webstore can price different packages in
// different currencies), so this caches one formatter per currency code
// instead of one per call - still just a handful of entries in practice.
const currencyFormatCache = new Map<string, Intl.NumberFormat>();

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return DATE_TIME_FORMAT.format(date);
}

export function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}

export function formatCurrency(value: number, currency?: string): string {
  if (!currency) return formatNumber(value);
  let formatter = currencyFormatCache.get(currency);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(undefined, { style: "currency", currency });
    } catch {
      return `${formatNumber(value)} ${currency}`;
    }
    currencyFormatCache.set(currency, formatter);
  }
  return formatter.format(value);
}

export function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** Strips HTML tags from a Tebex-authored description for use as a plain-text
 * `<meta name="description">` value - those fields are rendered as HTML
 * elsewhere (see the `dangerouslySetInnerHTML` usages across app/(store)/),
 * but metadata content must be plain text. */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
