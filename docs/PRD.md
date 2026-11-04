# PRD — Invoxa MVP

## Product
Invoxa is a multi-tenant SaaS for invoice and business finance management: customers, products/services, invoices, payments, expenses, reports, dashboard.

## Target customers
Freelancers, small service businesses, shops/retailers, agencies, small trading companies. Global + Myanmar.

## Principles
Easy to use, fast invoice creation/payment tracking, professional customizable invoices, multi-currency, secure tenant separation, i18n from start, accounting-ready architecture without full accounting in MVP.

## In scope (MVP)
Auth, business profile/logo/address/currency/tax, customers CRUD, products/services CRUD, invoices (create/edit/duplicate/delete drafts/send/PDF), invoice items (qty/price/discount/tax), payments (full/partial), expenses (record/categorize/edit/delete), dashboard (revenue/expenses/outstanding/overdue), reports (invoice/expense/payment), settings (numbering/currency/tax/localization), SaaS admin (businesses/users/subscriptions).

## Out of scope
Full double-entry bookkeeping, bank sync, payroll, inventory, auto tax filing, payment gateway processing, advanced statements, multi-warehouse, recurring invoices, portals, etc. (see spec §17).

## Roles
SaaS Admin, Owner, Admin, Staff, Viewer. Users can belong to multiple businesses; each business is an independent tenant.

## Core workflows
- Invoice: create → select customer → add items → calculate → save draft → issue → PDF → send → record payments → status updates (DRAFT/ISSUED/PARTIALLY_PAID/PAID/OVERDUE/VOID). Overdue derived from due date + outstanding balance.
- Expense: create → category → amount/currency/date → optional receipt → save → reports.
- Payment: open issued invoice → amount → method → date/reference → update balance → recalc status. Manual only.

## Acceptance criteria
See spec §16. Key: register/login/create business; invite members/roles; CRUD customers/products; multi-line invoices with correct tax/discount/totals; drafts/issue; PDF; full/partial payments with correct balances/statuses; expenses categorized; dashboard from DB; search/filter; en+my UI; tenant isolation; tests for critical workflows; backups tested.

## References
Full specification provided in project prompt / `docs/` siblings. Architecture: `ARCHITECTURE.md`; DB: `DATABASE.md`; API: `API.md`; Plan: `IMPLEMENTATION_PLAN.md`.