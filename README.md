# Kirat Astro

Vedic astrology platform for Bhutan, Nepal, India, and the Himalayan diaspora. Standalone project — its own git history, its own deploy, nothing shared with any other project in this workspace.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Framer Motion (`motion`) · Zustand · React Hook Form + Zod · TanStack Query · Prisma + Postgres (Supabase) · Supabase Auth · Stripe · Resend.

## Architecture

Feature-first. Business logic never lives in `app/`; pages compose from `features/*` and `components/ui/*`.

```
src/
  app/          route segments only — layout, page, route handlers, metadata
  components/   shared, feature-agnostic UI (shadcn primitives in components/ui)
  features/     one folder per domain feature (components + schema + store + types, colocated)
  hooks/        shared React hooks
  lib/          framework/client wiring (prisma, supabase, stripe, resend, cn)
  services/     business logic and external integrations, framework-agnostic
  providers/    app-wide context providers (query client, theme)
  types/        cross-cutting type declarations (e.g. env.d.ts)
  constants/    static config values
```

## Getting started

```bash
cp .env.example .env.local   # fill in Supabase, Stripe, Resend credentials
pnpm install
pnpm dev                      # http://localhost:3000
```

## Database

```bash
pnpm db:generate   # regenerate Prisma client after schema.prisma changes
pnpm db:migrate    # create + apply a migration (needs a real DATABASE_URL)
pnpm db:studio     # browse data
```

`DATABASE_URL` should point at Supabase's pooled connection (port 6543, `pgbouncer=true`); `DIRECT_URL` at the direct connection (port 5432) — Prisma needs the direct connection for migrations.

## Known gaps (by design, not oversight)

- **No real chart calculation engine.** `src/services/astrology/index.ts` defines the typed input/output contract but throws `AstrologyEngineNotConfiguredError`. Decide between a Swiss Ephemeris binding (self-hosted, most accurate, more ops overhead) and a hosted ephemeris API (faster to ship) before implementing it.
- **No Supabase project, Stripe account, or Resend domain provisioned yet.** `.env.example` documents every variable needed; nothing here works against real data until those are created and the values are filled in.
- **No auth middleware.** `lib/supabase/server.ts` and `client.ts` are ready to use, but there's no `middleware.ts` refreshing the session cookie yet — add one once a route needs to gate on being signed in.
- **No Vercel project linked yet.** `vercel link` / `vercel --prod` once you're ready to deploy.
