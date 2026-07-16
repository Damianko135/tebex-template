import type { components } from "tebex-headless";

type ErrorResponse = components["schemas"]["ErrorResponse"];

export class TebexApiError extends Error {
  readonly status: number | undefined;
  readonly detail: string | undefined;
  readonly instance: string | undefined;

  constructor(message: string, options: { status?: number; detail?: string; instance?: string }) {
    super(message);
    this.name = "TebexApiError";
    this.status = options.status;
    this.detail = options.detail;
    this.instance = options.instance;
  }
}

export class TebexNotConfiguredError extends Error {
  constructor() {
    super("TEBEX_STORE_TOKEN is not set. Configure it in your environment to enable live data.");
    this.name = "TebexNotConfiguredError";
  }
}

function isErrorResponseShape(value: unknown): value is ErrorResponse {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes an openapi-fetch error payload (RFC 7807 problem+json, or a
 * plain string body for endpoints that don't declare an error schema) into
 * a TebexApiError so every caller gets consistent `.message`/`.detail`.
 */
export function toTebexApiError(error: unknown, response: Response): TebexApiError {
  if (isErrorResponseShape(error)) {
    const title = "title" in error && typeof error.title === "string" ? error.title : undefined;
    const detail =
      "detail" in error && typeof error.detail === "string" ? error.detail : undefined;
    const instance =
      "instance" in error && typeof error.instance === "string" ? error.instance : undefined;
    return new TebexApiError(title ?? detail ?? `Request failed (${response.status})`, {
      status: response.status,
      detail,
      instance,
    });
  }

  return new TebexApiError(`Request failed (${response.status})`, { status: response.status });
}
