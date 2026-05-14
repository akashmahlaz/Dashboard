# Project Plan — Event Ticketing Dashboard

---

## Client's Exact Words

> "So the first step I want to do is to just, you know, extract the data from the APIs and put them onto a very simple dashboard, which shows me day by day, name of event, date of event, and how many tickets sold on a specific day. And that data needs to be refreshed at least twice every day, morning and evening."

> "Step two issue will be that we will start to plug in some of the marketing data into this — marketing currently is only meta. So meta — for every event I would be running some campaigns, some organic and some paid. Now that data also my social media team pulls but that sits on a separate physical dashboard. So eventually what I want to do is have a dashboard where at an every event level we can see whether the marketing is switched on and also the number of tickets that are sold on a day-to-day basis."

---

## What We Are Building

### Phase 1 — Ticketing Intelligence Dashboard

A clean, private, internal dashboard for event organizers. Core requirement:

- Pull data from ticketing platform APIs automatically
- Show a **day-by-day** breakdown per event:
  - Name of event
  - Date of event
  - Tickets sold on a specific day
- Data must refresh **at least twice every day** — once in the morning, once in the evening
- Manual "sync now" trigger available for ops use
- Every table row shows the last synced timestamp
- No third-party login required — internal tool, no public access

### Phase 2 — Marketing Intelligence Layer (Meta)

Extend the dashboard to overlay marketing context per event:

- Meta Ads integration (paid campaigns + organic)
- Per-event view showing:
  - Whether marketing is switched on or off
  - Campaign type (paid / organic)
  - Day-by-day ticket sales correlated with campaign activity
- Social media team no longer needs a separate physical dashboard
- Everything at one event level in one place

---

## Design Philosophy

**No flashy. No generic. No dark theme.**

This dashboard is for real operational use — not a demo, not a portfolio piece.

Rules we are following:

- Light, editorial UI — inspired by high-quality internal tools and business intelligence products
- Typography-first layout — the data should speak, not the chrome around it
- Every component is chosen intentionally, not dropped in generically
- No decorative gradients, no glowing cards, no animated blobs
- Tables and numbers are the hero elements — make them readable, not styled
- Color is used sparingly — only to communicate meaning (status, warning, positive delta)
- Whitespace is an asset, not wasted space
- No out-of-the-box shadcn copy-paste look — we adapt, we override, we compose

---

## UI Reference

Deep study of [https://github.com/akashmahlaz/justbecuase](https://github.com/akashmahlaz/justbecuase) for:

- Typography system — font pairing, size scale, weight rhythm
- Spacing and layout density decisions
- How components are composed rather than stacked
- Navigation and sidebar patterns
- How data-heavy views are handled without overwhelming the user
- Color usage in context — when it earns its place, when it does not

We are not copying JustBeCause. We are learning from its discipline and applying the same craft to a data-dense operations dashboard.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript | Fast development, strong ecosystem, team familiarity |
| Backend | Express 5, Node.js, TypeScript | Flexible, lightweight, separates sync logic cleanly from UI |
| Database | PostgreSQL via Supabase (managed) | Relational model suits event + daily sales grain, free tier for MVP |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, pairs well with component libraries |
| UI Components | shadcn/ui + Magic UI + Kokonut UI — used strategically | Not wholesale adopted — picked component by component based on what earns its place |
| Data Sources | Ticketing platform APIs (TBD per client's platforms) | Primary data source for Phase 1 |
| Marketing Data | Meta Ads API | Phase 2 — paid and organic campaign data per event |
| Package Manager | pnpm (workspaces) | Monorepo support, fast, disk efficient |
| Hosting | VPS — Nginx reverse proxy | Client preference, full control |
| Version Control | Monorepo — `client/` and `server/` in one Git repo | Simpler coordination, path-filtered CI for independent deploys |

---

## Data Model (Core)

```
events
  id, source_event_id, name, event_date, status, created_at

ticket_sales_daily
  id, event_id, sale_date, tickets_sold, synced_at

-- Phase 2
marketing_meta_daily
  id, event_id, metric_date, campaign_status, campaign_type,
  spend, impressions, clicks, reach, synced_at

sync_runs
  id, source, started_at, finished_at, status, records_processed, error_summary
```

---

## Sync Strategy

- Two scheduled sync runs per day: **morning (07:00)** and **evening (19:00)** local time
- Idempotent upserts — safe to re-run without creating duplicates
- Incremental fetch where APIs support `updated_since`
- All sync runs logged to `sync_runs` table
- Failed syncs surface as a visible warning on the dashboard
- Manual trigger available from an admin panel

---

## Folder Structure (Monorepo)

```
Dashboard/
├── client/              # Next.js 16 frontend
│   ├── app/             # App Router pages and layouts
│   ├── components/      # UI components (shadcn base + custom compositions)
│   ├── lib/             # API clients, utilities, hooks
│   └── public/          # Static assets
├── server/              # Express 5 backend
│   ├── src/
│   │   ├── routes/      # REST API route handlers
│   │   ├── jobs/        # Sync jobs (ticketing, meta)
│   │   ├── db/          # PostgreSQL queries and schema
│   │   └── utils/       # Shared utilities
│   └── package.json
├── .gitignore
├── README.md
└── plan.md              # This file
```

---

## Deployment Architecture (VPS)

```
Internet
   |
Nginx (reverse proxy)
   |
   |--- /api/*  -->  Express (port 5000)
   |--- /*      -->  Next.js (port 3000)

Cron scheduler --> sync jobs inside Express (or system cron calling API)
```

---

## CI/CD Strategy

- One Git repo, two deploy pipelines
- Pipeline detects changed paths on each push:
  - `client/**` changed → build and restart Next.js only
  - `server/**` changed → build and restart Express only
  - Both changed → both restart
- Future: Docker Compose with separate images per app, independent rebuild and rollout

---

## Future Workflow (Phase 3+)

- Add more ticketing platform integrations as client's portfolio grows
- Event-level ROI view: ad spend vs. ticket revenue per day
- Automated alerts if ticket sales drop below threshold while marketing is active
- Export to CSV for finance and reporting
- Potentially: multi-user access with role-based views (ops vs. finance vs. marketing)
- Containerize both apps with Docker — separate images, lighter containers, independent scaling
- Evaluate splitting into separate repos only if dedicated separate teams are assigned

---

---

## Progress Log

### Phase 1 — Scaffold ✅ COMPLETE (Session 2)

**What was built:**
- `server/tsconfig.json` — TypeScript config for Express (NodeNext module resolution)
- `server/prisma/schema.prisma` — Rewritten: Auth.js models + Event, TicketSalesDaily, SyncRun. Prisma 7 compatible (no `url` in datasource, it lives in `prisma.config.ts`)
- `server/lib/prisma.ts` — Prisma 7 singleton using `PrismaPg` driver adapter (required by Prisma 7)
- `server/app.ts` — Clean Express entry: trust proxy, cors, ExpressAuth, health endpoint
- `server/controllers/auth.ts` — Zod-validated signup controller, typed, no `any`
- `server/models/users.ts` — bcryptjs password hashing, returns only safe fields
- `server/routes/auth.ts` — Thin route, delegates to controller
- `client/lib/constants.ts` — `APP_NAME`, `APP_TAGLINE`, `API_BASE_URL`
- `client/lib/types.ts` — `Event`, `TicketSalesDaily`, `DailyEventRow`, `SyncStatus`, `SyncRun`, `ApiError`
- `client/app/layout.tsx` — Updated metadata
- `client/app/page.tsx` — Clean landing page: header, hero, Enter Dashboard CTA, footer
- `client/components/dashboard/DashboardNav.tsx` — Sidebar nav (Overview, Events, Sync Status)
- `client/components/dashboard/DashboardShell.tsx` — SidebarProvider + SidebarInset layout wrapper
- `client/app/dashboard/page.tsx` — Temp dashboard: 3 stat cards + placeholder for ticket table
- `client/components/ui/calendar.tsx` — Removed invalid `table` classname key (react-day-picker v10 compat)

**Key decisions:**
- Prisma 7 requires `@prisma/adapter-pg` + driver adapter instantiation (breaking change from v6)
- Prisma 7 generated entry is `client.ts` not `index.js`; import from `"../generated/prisma/client.js"`
- `react-day-picker` stays on v10; shadcn calendar `table` classname key removed (not in v10 ClassNames type)
- `pnpm exec tsc --noEmit` is the only type check run during development — no `pnpm build` or `pnpm lint`

**Current state (as of commit 0075b92):**
- Server `tsc --noEmit` → 0 errors ✅
- Client `tsc --noEmit` → 0 errors ✅
- All work pushed to `main`

---

### Phase 1 — Next Steps

- [ ] Identify the ticketing platform API(s) the client is using
- [ ] Build the sync job: fetch from ticketing API → upsert into `ticket_sales_daily`
- [ ] Set up cron (node-cron or system cron) to run sync at 07:00 and 19:00
- [ ] Build the real ticket sales table in `client/app/dashboard/page.tsx`
- [ ] Wire the table to the API via `client/lib/api/sales.ts`
- [ ] Implement the manual "sync now" button and show `sync_runs` status
- [ ] Set up `.env` files and Supabase connection

*This plan is a living document. Update it as requirements evolve.*
