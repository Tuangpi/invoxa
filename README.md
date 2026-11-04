# invoxa

Invoxa — multi-tenant invoice & business finance SaaS (MVP).

See `docs/` for product, architecture, database, API, implementation plan, and coding standards.

## Quick start (dev)

1. Copy env: `cp .env.example .env` and set `DATABASE_URL`.
2. Install: `npm install`
3. Prisma: `npx prisma validate && npx prisma format`
4. API dev: `npm run dev:api`

## Structure

- `apps/api` — Express + TS API (modular monolith)
- `apps/web` — React + Vite web (placeholder)
- `packages/shared` — shared types/schemas
- `prisma` — Prisma schema/migrations
- `docs` — planning documents
