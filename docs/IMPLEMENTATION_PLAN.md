# Implementation Plan — Invoxa

## Phase 1 — Foundation (Critical)
Auth, database, business registration, tenant isolation, membership/permissions.

## Phase 2 — Business Management
Customers, products/services, business settings, invoice numbering.

## Phase 3 — Invoice Management (Core MVP)
Invoice editor, calculations, tax, discounts, draft/issue/void, PDF.

## Phase 4 — Payments
Manual payment recording, partial payments, history, overdue tracking.

## Phase 5 — Expenses & Reports
Expense management, dashboard metrics, financial summaries.

## Phase 6 — SaaS Features
Subscriptions/plans/limits, email notifications, team invites, admin panel.

## Phase 7 — Production Readiness
Security review, automated tests, CI/CD, backups, monitoring, deployment.

## Working rules
Implement one module at a time; TS strict; Zod validation; thin controllers; repositories; tenant isolation at service+repo; transactions for financial ops; tests alongside; no floats for money; refactor large files; update docs; run lint/typecheck/tests. Recommended workflow: Understand → Inspect → Plan → Implement module → Tests → Typecheck/lint → Tests → Security/tenant review → Refactor → Docs.