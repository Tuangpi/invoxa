# Coding Standards — Invoxa

- Follow existing conventions; idiomatic TS; clear readable code; meaningful names; focused modules; explicit errors; validate at boundaries; no premature optimization; reuse existing utilities; remove dead code; avoid unnecessary deps/abstractions.
- Structure: cohesive modules, separate concerns, avoid huge files (>500 review, >1000 refactor), incremental refactoring.
- Backend: controllers thin; logic in services; DB in repositories; Zod validation; centralized errors; authz server-side; parameterized queries via Prisma; transactions for atomic ops.
- Frontend: reusable components; separate UI/logic/API; loading/error/empty/success states; no duplicated business logic.
- DB: follow schema; transactions; indexes/constraints; never modify prod data/destructive migrations without approval.
- Security: no secrets; env vars; validate/sanitize; server-side authz; never trust client roles/prices/permissions/payment status; rate limiting; security headers.
- Money: never JS floats; use Decimal/integer minor units as appropriate; backend recalculates.
- Tenant isolation: enforce on every query; never trust client business_id.
- Testing: unit for calculations/balances; integration for workflows/tenant/roles; API validation; E2E key flows.
- Docs: update README/ARCHITECTURE/DATABASE/API/IMPLEMENTATION_PLAN when changed.