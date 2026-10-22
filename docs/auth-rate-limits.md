# Authentication request limits

The signup and login endpoints allow 5 requests per minute per IP each. Refresh allows 20 requests per minute per IP and does not require an access token. Excess requests receive HTTP 429 with a Retry-After header before password verification or token processing.

These endpoints explicitly skip the ipStrict and emailStrict named policies, which are reserved for the forgot-password flow. Failed login attempts also count. Counters are independent per endpoint. The default tracker uses Express req.ip; configure trusted proxies explicitly for deployment rather than accepting arbitrary forwarding headers.

The current Nest throttler uses in-memory counters per API process. Multiple replicas require shared throttling storage to enforce a deployment-wide limit. Redis session storage does not automatically share these counters.

Regression tests run an isolated Nest HTTP application with real throttling guards and mocked account operations: `npm test -- --runInBand --runTestsByPath src/auth/auth-throttling.spec.ts src/auth/auth-refresh.spec.ts`.
