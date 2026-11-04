# Architecture — Invoxa

## Style
Modular monolith + clean architecture. Modules independent; deployed as one app.

## Stack
Frontend: React + TS + Vite; Tailwind + shadcn/ui. Backend: Express + Node + TS. DB: PostgreSQL + Prisma. Validation: Zod. Auth: JWT + refresh. PDF: Playwright/PDFKit. Storage: S3-compatible private. API docs: OpenAPI. Tests: Vitest + Supertest.

## Backend request flow
`Route → Middleware → Controller → Service → Repository → Database`

- Routes: endpoints.
- Middleware: auth, authorization, validation.
- Controllers: HTTP in/out only.
- Services: business logic.
- Repositories: DB access.
- Shared utils: reusable tech.

Avoid business logic in controllers/repositories. Use DTOs + Zod. Transactions for multi-record ops.

## Backend modules
Auth, Business, Customers, Products, Invoices, Payments, Expenses, Reports, Files, Notifications, Subscriptions, Audit.

## Module file pattern
`*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.schema.ts`, `*.types.ts`.

## Multi-tenancy
Every business-owned record has `business_id`. Never trust client business_id; verify membership + permissions. Repository queries always enforce tenant isolation.

## Frontend structure
Feature-based under `apps/web/src/features/*`; TanStack Query for server state; React Hook Form + Zod; reusable tables; loading/empty/error states; route-level permission checks. Avoid duplicating backend calculations.

## Non-functional
Responsive, secure isolation, transactions, pagination, search/filter, consistent errors, automated tests, backups, logging/monitoring, horizontal scaling readiness.