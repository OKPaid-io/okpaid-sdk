# @okpaid-io/sdk

Typed TypeScript client for the [OKPaid POS API](https://api.okpaid.io).
Types are generated from the published OpenAPI 3.0.0 spec
(`help.okpaid.io/openapi/openapi.json`) with [openapi-typescript](https://openapi-ts.dev)
and use [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) at runtime.

- Zero runtime dependencies beyond `openapi-fetch`
- Works in Node >= 18, browsers, and Workers
- Endpoint paths, params, request bodies, and response shapes are type-checked
  against the live API contract

## Quickstart

1. **Create an API key.** In the OKPaid web app go to Admin -> Organization -> API Keys
   (`/admin/organization/api-keys`), create a key, and copy it. It is shown only once.
2. **Install the SDK.**

   ```bash
   npm i @okpaid-io/sdk
   # or: pnpm add @okpaid-io/sdk / yarn add @okpaid-io/sdk
   ```

3. **Make your first typed call.**

   ```ts
   import { createOKPaidClient } from "@okpaid-io/sdk";

   const client = createOKPaidClient({ apiKey: process.env.OKPAID_API_KEY });

   const { data, error, response } = await client.GET("/api/v1/organizations/{orgId}/customers", {
     params: { path: { orgId: "org_abc" }, query: { limit: 25 } },
   });
   ```

## Install

```bash
npm i @okpaid-io/sdk
# or: pnpm add @okpaid-io/sdk / yarn add @okpaid-io/sdk
```

## Usage

### Server (API key auth)

```ts
import { createOKPaidClient } from "@okpaid-io/sdk";

const client = createOKPaidClient({ apiKey: process.env.OKPAID_API_KEY! });

const { data, error, response } = await client.GET(
  "/api/v1/organizations/{orgId}/customers",
  { params: { path: { orgId: "org_abc" }, query: { limit: 25 } } },
);

if (error) {
  console.error(response.status, error);
} else {
  for (const customer of data.customers) {
    console.log(customer.name);
  }
}
```

### Browser (session cookie auth)

```ts
import { createOKPaidClient } from "@okpaid-io/sdk";

const client = createOKPaidClient({ credentials: "include" });

const { data } = await client.GET("/api/v1/subscriptions/tiers");
```

### Mutations

```ts
const { data, error } = await client.POST("/api/v1/organizations/{orgId}/customers", {
  params: { path: { orgId: "org_abc" } },
  body: { name: "Alice", phone: "+85512345678" },
});
```

Per-request `fetch` options are passed through, so anything `fetch` supports
(headers, AbortSignal, etc.) is available on every call.

## Auth

Two auth modes, matching the backend:

- **API key**: pass `apiKey` at construction; the SDK sends `x-api-key` on
  every request. Use this for server-side integrations.
- **Session cookie**: pass `credentials: "include"` (browser). The backend's
  Better Auth session cookie is sent automatically.

## Regenerating types

The OpenAPI spec is pinned at `spec/openapi.json` and the generated types are
committed. When the API changes:

```bash
# pull the live spec and regenerate (requires network access to help.okpaid.io)
pnpm generate:remote
# or regenerate from the pinned spec
pnpm generate
```

Bump the package version alongside API surface changes so published versions
track backend releases.

## Development

```bash
pnpm install
pnpm test        # bun test (client behavior + type checks)
pnpm type-check  # tsc --noEmit
pnpm build       # emit dist/ (ESM + d.ts)
pnpm lint:check  # biome
```

## License

MIT
