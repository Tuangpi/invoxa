# Database — Invoxa

## Engine
PostgreSQL + Prisma. Use `Decimal` for money, never floats. Currency ISO 4217.

## Multi-tenancy
All business-owned records contain `business_id`. Enforce via service + repository. Compound tenant-aware FKs/transactional checks to prevent cross-business links.

## Money & precision
- `Decimal(19,4)` for amounts; `Decimal(7,4)` for rates.
- Preserve invoice currency separately from business base currency.
- Recalculate totals server-side; never trust client totals.

## Invoice snapshots
On issue, snapshot customer + items. Later customer/product changes must not alter issued invoices.

## Payment integrity
- Payments reference invoice same business.
- Partial payments supported.
- Payments must not exceed outstanding balance (unless overpayment explicitly supported).
- No hard-delete of payments; use reversal/void with audit.
- No payments against DRAFT/VOID invoices.

## Invoice numbering
Unique per business. Transaction + atomic sequence increment to avoid duplicates under concurrency.

## Historical records
Issued invoices not freely editable. Use void + correction workflows.

## Core models
User, Business, BusinessMember, Customer, Product, Invoice, InvoiceItem, Payment, Expense, ExpenseCategory, InvoiceSequence, File, AuditLog, Subscription, Plan. See `prisma/schema.prisma`.

## Indexes/deletion
Add explicit indexes and deletion policies per model; cascade carefully (e.g., invoice items cascade on invoice delete only for drafts; payments protected).

## References
Spec §6–§7. Prisma schema: `../prisma/schema.prisma`.