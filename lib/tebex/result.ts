import "server-only";

import type { operations } from "tebex-headless";

import { TebexNotConfiguredError, toTebexApiError, type TebexApiError } from "./errors";

/**
 * Extracts an operation's 200 JSON response type directly from the
 * generated `operations` map, rather than the equivalent `components`
 * schema. openapi-typescript sometimes emits structurally distinct (but
 * equivalent) shapes for discriminated unions depending on which path
 * resolves a $ref, so re-deriving from `operations` guarantees the type
 * matches exactly what `client.GET/POST/...` actually returns.
 */
export type OperationResponse<Op extends keyof operations> =
  operations[Op]["responses"] extends { 200: { content: { "application/json": infer R } } }
    ? R
    : never;

export type TebexResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: TebexApiError | TebexNotConfiguredError };

type FetchResponse<T> = Promise<{ data?: T; error?: unknown; response: Response }>;

export async function unwrapTebexResponse<T>(promise: FetchResponse<T>): Promise<TebexResult<T>> {
  const { data, error, response } = await promise;
  if (error !== undefined) {
    return { ok: false, error: toTebexApiError(error, response) };
  }
  return { ok: true, data: data as T };
}

export const tebexNotConfigured = <T>(): TebexResult<T> => ({
  ok: false,
  error: new TebexNotConfiguredError(),
});

/**
 * Single-resource lookups (`getCategory`, `getPackage`) reuse the same
 * generated response schema as their list counterparts, which types `data`
 * as an array (`Category[]`, `Package[]`) - but the live Headless API wraps
 * a single object for these endpoints, verified directly against
 * `GET /categories/{id}` (`{"data":{"id":...}}`, not `{"data":[{...}]}`).
 * Callers used to do `.data?.[0]`, which is `undefined` for every real
 * single-object response - silently treating every existing category/package
 * as "not found". This normalizes either shape defensively, in case that
 * ever changes upstream.
 */
export function unwrapSingle<T>(data: T | T[] | null | undefined): T | undefined {
  return Array.isArray(data) ? data[0] : (data ?? undefined);
}

export interface BasicAuthCredentials {
  username: string;
  password: string;
}

export function basicAuthHeader({ username, password }: BasicAuthCredentials): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}
