# Zephr Admin Application

A fast, admin-first control panel for Zephr accounts, users, groups, and product access. This README blends product context, architecture, and hands‑on implementation detail so engineers and stakeholders can move in lockstep.

---

## Executive Summary

**Who it’s for:** Customer admins who manage large rosters (hundreds → tens of thousands of users) and their access to products.

**What it does:**
- Lists account users instantly (cached + paginated), with quick search and attribute filtering
- Edits user attributes (first/last name, org, country, job area/function, etc.)
- Assigns users to **Groups** with optional demographic defaults
- Surfaces **Product Grants** per account
- Keeps a **local Postgres mirror** in sync with Zephr for speed, reliability, and reporting

**Why it matters:** Admins should feel the UI is instantaneous even when Zephr APIs are busy, rate‑limited, or paginating. We achieve that by mirroring the minimum viable dataset in Postgres and reconciling in the background while persisting an audit trail.

---

## Table of Contents

1. [Environment & Secrets](#environment--secrets)
2. [Personas, Goals, KPIs](#personas-goals-kpis)
3. [Architecture Overview](#architecture-overview)
4. [Data Model (Postgres)](#data-model-postgres)
5. [Zephr Admin API Usage](#zephr-admin-api-usage)
6. [Performance Plan (Next.js + DB)](#performance-plan-nextjs--db)
7. [User & Group Workflows](#user--group-workflows)
8. [Local Development](#local-development)
9. [Operational Runbook](#operational-runbook)
10. [Security & Compliance](#security--compliance)
11. [Testing Strategy](#testing-strategy)
12. [Roadmap & Backlog](#roadmap--backlog)

---

## Environment & Secrets

Required app configuration:

```
# Zephr Admin API
ZEPHR_BASE_URL=https://alm.api.zephr.com
ZEPHR_PUBLIC_BASE_URL=alm-lawcom-live.non-prod.cdn.zephr.com
ZEPHR_ACCESS_KEY=...
ZEPHR_SECRET_KEY=...

# Database (pg)
DATABASE_URL=postgres://user:pass@host:5432/db

# Cron/Tasks
CRON_SECRET=some-long-random

# Next.js
NODE_ENV=development

# Base URL of the User Index service that handles extended profile GET/PUT
# Example: https://user-index.internal.example.com
USER_INDEX_BASE_URL=
```

> **Auth:** All Zephr requests are HMAC‑SHA256 signed. We centralize signing in `lib/api-client.ts`.

---

## Personas, Goals, KPIs

**Primary Persona:** Account Administrator (non‑technical, time‑sensitive)

**Top Goals**
- Load Users page instantly (≤ 300ms interactive on cached data)
- Assign users to a group with visual confirmation in < 1s
- Search/filter users across large accounts < 250ms p95

**KPIs**
- **p95 Users page TTFB:** < 200ms (server cached + SSR streaming)
- **p95 Group assign latency (UI):** < 1s (optimistic update + background persist)
- **Sync lag tolerance:** ≤ 1 min for eventual consistency with Zephr
- **Error budget:** < 0.1% failed admin interactions/month

---

## Architecture Overview

**Next.js (App Router, Server Components + Actions)**
- SSR lists and details from Postgres for speed & stability
- Server Actions call Zephr for mutations (PATCH) and then reconcile DB

**Postgres Mirror**
- Mirrors the subset of Zephr entities we need for fast UI & reporting
- Tracks group membership and counts without scanning user lists

**Background Sync (Cron)**
- Scheduled reconciler fetches authoritative data from Zephr and upserts into Postgres (idempotent)
- UI posts lightweight membership deltas for live accuracy between sync cycles

**Caching**
- RSC/route segment caching for list pages
- In‑process LRU for small reference data (groups, templates)

Diagram (text):

```
Admin → Next.js (SSR/RSC) → Postgres (mirror)
                 ↓ mutate
             Server Actions → Zephr Admin API
                 ↑ reconcile
        Background Sync (cron task)
```

---

## Data Model (Postgres)

_Schema focus: fast reads, simple reconciliation, auditable membership changes._

```
-- Accounts
accounts(
  id uuid primary key,
  slug text unique,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Users (global identity across accounts)
users(
  id uuid primary key, -- zephr user_id
  email text not null unique,
  attributes jsonb not null default '{}',
  created_at timestamptz,
  updated_at timestamptz
);

-- Many-to-many: which users belong to which account
account_users(
  account_id uuid references accounts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  user_type text,
  primary key (account_id, user_id),
  created_at timestamptz default now()
);

-- Groups (as defined in app)
groups(
  id uuid primary key,
  account_id uuid references accounts(id) on delete cascade,
  slug text not null,
  name text not null,
  color text,
  icon text,
  default_template text,
  product_grant_ids text[] not null default '{}',
  demographics jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(account_id, slug)
);

-- Memberships (single-group model: at most one active per user/account)
group_memberships(
  account_id uuid not null,
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  assigned_by text,
  assigned_at timestamptz default now(),
  primary key (account_id, user_id)
);

-- Optimized counts (denormalized for UI)
-- We maintain via small write-deltas from the UI + periodic reconciliation.
-- Alternatively implement as a materialized view if consistency > write-speed.

-- Optional audit log
audit_events(
  id bigserial primary key,
  at timestamptz default now(),
  actor text,
  kind text, -- e.g., "user.update", "group.assign"
  account_id text,
  user_id uuid,
  group_id uuid,
  payload jsonb
);
```

**Indexes (critical)**
- `users(email)`
- `account_users(account_id, user_id)`
- `group_memberships(account_id, group_id)` and `group_memberships(account_id, user_id)`
- Trigram index on `users.email` for fast search (optional): `CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE INDEX users_email_trgm ON users USING gin (email gin_trgm_ops);`

---

## Zephr Admin API Usage

**Users (read list)**
- `GET /v3/accounts/{accountId}/users` → seed/update `users` + `account_users`

**User (read details)**
- `GET /v3/users/{userId}` → hydrate full `attributes` in `users.attributes`

**User (update attributes)**
- `PATCH /v3/users/{userId}/attributes` (JSON body of changed fields)

**Grants → Products (per account)**
- `GET /v3/accounts/{accountId}/grants` → show account products; optionally enrich via `GET /v3/products/{productId}`

> We centralize Zephr calls and HMAC signing in `lib/api-client.ts`. Server Actions wrap these calls to keep secrets server-side.

---

## Performance Plan (Next.js + DB)

**Server-first rendering**
- Users list is **SSR from Postgres** with pagination. Data arrives immediately; Zephr calls do not block UI.
- **RSC streaming** ensures first paint while heavier sections (e.g., products) complete.

**Optimistic UI**
- When assigning a group, we update the row(s) and the **right-rail group counts** instantly, then fire:
  1) `PATCH /v3/users/{id}/attributes` to Zephr
  2) `POST /api/groups/membership` to persist count deltas & membership in DB

**Caching**
- In-memory LRU for `groups` and template names
- Route segment cache with short TTL for Users page (e.g., 15–30s) with tag invalidation on mutations

**DB tuning**
- Proper composite indexes (see above)
- Avoid N+1: single query to fetch users for account + counts per group
- Use `LIMIT/OFFSET` for pagination; consider keyset pagination later for very large datasets

**Search & Filtering**
- Server-driven search with indexed columns (email, job-area/function). For fuzzy email search, enable `pg_trgm`.
- Debounced client input → `/api/users/search` (SSR-compatible) returning results under 250ms p95 on indexed fields.

---

## User & Group Workflows

**Edit User (modal)**
1. Open modal → fetch authoritative details via `GET /v3/users/{userId}` (server action)
2. Pre-fill attributes from Postgres; overlay Zephr response for any drift
3. Save → `PATCH /v3/users/{userId}/attributes`
4. If `group` changed: update `group_memberships`, adjust **both** old & new group counts, then reconcile

**Assign to Group (drag/drop or bulk apply)**
- Client computes membership **deltas** (e.g., `+25` to target, `-25` from old if moving)
- Posts deltas to `/api/groups/membership` for DB update
- Issues Zephr attribute patch with demographic defaults from the group (country, job-area, job-function if set)

**Apply Template**
- Templates are attribute sets (default + custom) stored server-side
- Applying a template merges into edited attributes before save; success toast displays only **after** a successful Zephr PATCH

---

## Local Development

**Prereqs**
- Node 20+
- Postgres 14+ (local or Neon)

**Install & run**
```
npm install
npm run dev
# open http://localhost:3000
```

**Database**
- Run SQL from `/lib/db/migrations/*.sql`
- Seed minimal data: accounts, groups

**Key folders**
```
app/
  api/                # API routes (membership deltas, search, templates)
  (pages)/            # RSC/SSR pages
components/
  pages/users-table.tsx
  user-edit-button.tsx
  user-edit-modal.tsx
lib/
  api-client.ts       # HMAC Zephr client
  user-api.ts         # Zephr user helpers (get details, update, list by account)
  user-actions.ts     # Server Actions that wrap user mutations
  groups.ts           # Group CRUD (Postgres)
  db.ts               # pg client
  search.ts           # server-side search helpers
```

---

## Operational Runbook

**Sync Job (cron)**
- `GET /v3/accounts/{accountId}/users` → upsert `users` & `account_users`
- Recompute `group_memberships` by resolving `attributes.group` to our known group IDs (case/slug/ID tolerant)
- Refresh group counts from memberships (authoritative backfill)
- Log reconciliation stats in `audit_events`

**On Mutation**
- Server Action updates Zephr first; on success we:
  - Apply local **membership delta** (old → new) for counts
  - Upsert user attributes into `users`
  - Invalidate caches via Next.js `revalidateTag("users:{accountId}")`

**Monitoring**
- Track: API error rates, p95 latencies, queue lengths, sync lag
- Alerts on: sustained 4xx/5xx to Zephr, DB connection spikes, sync drift > 5 minutes

---

## Security & Compliance

- HMAC signing kept server-side; **no admin secrets in the browser**
- Principle of least privilege on DB roles
- PII: limit columns and logs; avoid dumping raw attributes in debug logs in production
- Rotate Zephr keys regularly

---

## Testing Strategy

- **Unit:** signing, group resolution, membership deltas
- **Integration:** Users list SSR path → DB → cache; attribute PATCH happy path & failure fallbacks
- **E2E (Playwright):** open Users, search, drag to group, confirm counts update immediately, refresh page → counts persist
- **Load test:** search endpoint and users list pagination with 50k users

---

## Roadmap & Backlog

**Near-term (now → 2 sprints)**
- ✅ Server-first SSR of Users list from Postgres
- ✅ Optimistic group assign with immediate count updates
- ✅ Template application merged into user edit flow
- Debounced server search with indexed fields and cached results
- Bulk operations progress UI (batched PATCH with retry)
- Sync job metrics page (drift, last-run, durations)

**Mid-term**
- Advanced filters (country, job-area/function, org) with persisted views
- Keyset pagination for super-large accounts
- Partial revalidation (tagged RSC cache) on user updates
- Product grants panel caching & background hydration

**Templates (Backlog)**
- Keep current single `groups.default_template` behavior
- Later split into dedicated tables:
  - `templates` (base)
  - `radar_templates`  
  - `mylaw_templates`  
  - `scholar_templates`
- UI: namespace selector + preview/apply

**Longer-term**
- Webhook ingestion (if/when available) to reduce sync polling
- Edge function candidates for ultra‑low‑latency reads (optional)
- Per‑account analytics (active users, engagement proxies)

---

## Contributing

- Use conventional commits
- Include before/after metrics for any performance PR
- Add/adjust indexes with a migration and a rollback plan

---

## License

Copyright reserved.

## Extended Profile Proxy

Configure one of the following upstream modes (default: proxy):

```
# Mode: "proxy" (default) or "zephr"
USER_INDEX_UPSTREAM=proxy

# If proxy mode: base URL for upstream service
USER_INDEX_BASE_URL=https://user-index.internal.example.com

# If zephr mode: use HMAC-signed admin API via ZEPHR_* envs
USER_INDEX_UPSTREAM=zephr
# Optional: override path prefix used for Zephr admin calls (default /v3/users)
USER_INDEX_ZEPHR_PREFIX=/v3/users

# Existing Zephr envs used by adminApiCall
ZEPHR_BASE_URL= https://alm.api.zephr.com
ZEPHR_ACCESS_KEY=...
ZEPHR_SECRET_KEY=...
```

Routes:
- GET /api/user-index/users/:id/profile/:appId
- PUT /api/user-index/users/:id/profile/:appId

In `zephr` mode the route uses HMAC signing (adminApiCall). In `proxy` mode it forwards the request as-is to USER_INDEX_BASE_URL.
