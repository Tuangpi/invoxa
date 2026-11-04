# API — Invoxa

Base URL: `/api/v1`. Consistent JSON: `{ success, data }` or error envelope. HTTP status codes correct. Pagination/filtering/sorting/search. Zod validation on body/params/query. Centralized errors. Request IDs. OpenAPI docs.

## Auth
POST /auth/register, /auth/login, /auth/refresh, /auth/logout, /auth/forgot-password, /auth/reset-password; GET /auth/me.

## Business
POST /businesses; GET /businesses; GET /businesses/:id; PATCH /businesses/:id; GET /businesses/:id/members; POST /businesses/:id/members; PATCH /businesses/:id/members/:memberId.

## Customers
GET/POST /customers; GET/PATCH/DELETE /customers/:id (delete = archive).

## Products
GET/POST /products; GET/PATCH/DELETE /products/:id (delete = archive).

## Invoices
GET/POST /invoices; GET/PATCH /invoices/:id; POST /invoices/:id/issue; /send; /void; /duplicate; GET /invoices/:id/pdf.

## Payments
GET /payments; POST /invoices/:id/payments; GET /payments/:id; POST /payments/:id/reverse.

## Expenses
GET/POST /expenses; GET/PATCH/DELETE /expenses/:id.

## Reports & Dashboard
GET /dashboard/summary; GET /reports/invoices; /reports/payments; /reports/expenses.

## Security
Auth via JWT + refresh; RBAC; tenant isolation; rate limiting; security headers; file/PDF authorization.>