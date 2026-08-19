import createClient, { type Client, type ClientOptions } from "openapi-fetch";
import type { paths } from "./generated/api";

export type { paths } from "./generated/api";
export { createClient };

export const DEFAULT_BASE_URL = "https://api.okpaid.io";

export interface OKPaidClientOptions extends ClientOptions {
  /** Base URL of the OKPaid API (default: https://api.okpaid.io). */
  baseUrl?: string;
  /**
   * Organization API key (x-api-key). Server-side integrations use this;
   * browser integrations with a logged-in session should instead pass
   * `credentials: "include"` and omit the key.
   */
  apiKey?: string;
  /** Send cookies on cross-origin requests (browser session auth). */
  credentials?: RequestCredentials;
  /** Default headers applied to every request. */
  headers?: HeadersInit;
}

/**
 * Typed OKPaid API client, generated from the published OpenAPI 3.0.0 spec.
 *
 * Browser (session cookie auth):
 * ```ts
 * const client = createOKPaidClient({ credentials: "include" });
 * const { data } = await client.GET("/api/v1/subscriptions/tiers");
 * ```
 *
 * Server (API key auth):
 * ```ts
 * const client = createOKPaidClient({ apiKey: process.env.OKPAID_API_KEY });
 * const { data } = await client.GET(
 *   "/api/v1/organizations/{orgId}/customers",
 *   { params: { path: { orgId } } },
 * );
 * ```
 */
export function createOKPaidClient(options: OKPaidClientOptions = {}): Client<paths> {
  const { apiKey, credentials, headers, ...rest } = options;
  return createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    credentials,
    headers: {
      ...(apiKey ? { "x-api-key": apiKey } : {}),
      ...headers,
    },
    ...rest,
  });
}
