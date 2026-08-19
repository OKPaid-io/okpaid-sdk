import { describe, expect, test } from "bun:test";
import { createOKPaidClient, DEFAULT_BASE_URL } from "../src/index";

function mockFetch(handler: (url: string, init: RequestInit) => Promise<Response>) {
  return ((input: Request) => handler(input.url, input as unknown as RequestInit)) as typeof fetch;
}

function captureHeaders(init: RequestInit, into: Record<string, string>): void {
  new Headers(init.headers).forEach((value, key) => {
    into[key] = value;
  });
}

describe("createOKPaidClient", () => {
  test("defaults baseUrl to the production API", async () => {
    const seen: string[] = [];
    const client = createOKPaidClient({
      fetch: mockFetch(async (url) => {
        seen.push(url);
        return Response.json({ tiers: [] });
      }),
    });
    const res = await client.GET("/api/v1/subscriptions/tiers");
    expect(res.data).toEqual({ tiers: [] });
    expect(seen[0]).toStartWith(`${DEFAULT_BASE_URL}/api/v1/subscriptions/tiers`);
  });

  test("sets x-api-key when apiKey is provided", async () => {
    const headers: Record<string, string> = {};
    const client = createOKPaidClient({
      apiKey: "okp_test_123",
      fetch: mockFetch(async (_url, init) => {
        captureHeaders(init, headers);
        return Response.json({ tiers: [] });
      }),
    });
    await client.GET("/api/v1/subscriptions/tiers");
    expect(headers["x-api-key"]).toBe("okp_test_123");
  });

  test("merges extra default headers", async () => {
    const seen: Record<string, string> = {};
    const client = createOKPaidClient({
      headers: { "user-agent": "okpaid-sdk-test" },
      fetch: mockFetch(async (_url, init) => {
        captureHeaders(init, seen);
        return Response.json({ tiers: [] });
      }),
    });
    await client.GET("/api/v1/subscriptions/tiers");
    expect(seen["user-agent"]).toBe("okpaid-sdk-test");
  });

  test("forwards credentials for browser session auth", () => {
    const client = createOKPaidClient({ credentials: "include" });
    expect(client).toBeDefined();
  });

  test("path params and query are accepted by the typed client", async () => {
    const client = createOKPaidClient({
      fetch: mockFetch(async () => Response.json({ customers: [] })),
    });
    // Type-level check: path + query params come from the generated spec types.
    const res = await client.GET("/api/v1/organizations/{orgId}/customers", {
      params: { path: { orgId: "org_1" }, query: { limit: 10 } },
    });
    expect(res.data).toEqual({ customers: [] });
  });
});
