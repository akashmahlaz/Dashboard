# Event Ticketing Dashboard

A monorepo containing the frontend and backend for a private event analytics dashboard. Built to give event organizers a real-time, day-by-day view of ticket sales across all their events, with marketing intelligence layered in as a second phase.

---

## Repository Structure

```
Dashboard/
├── client/          # Next.js 16 frontend — dashboard UI
├── server/          # Express 5 backend — data ingestion, sync jobs, REST API
├── .gitignore
└── README.md
```

Frontend and backend are independent apps tracked in the same repository. CI/CD is configured with path filters so only the changed app redeploys on each push.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Magic UI, Kokonut UI |
| Backend | Express 5, Node.js, TypeScript |
| Database | PostgreSQL (Supabase managed) |
| Data Sources | Ticketing platform APIs (event-specific) |
| Marketing | Meta Ads API (Phase 2) |
| Deployment | VPS — separate services, Nginx reverse proxy |
| Package Manager | pnpm (workspaces) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database (Supabase or self-hosted)

### Install dependencies

```bash
# From root
pnpm install
```

### Environment setup

```bash
# Frontend
cp client/.env.example client/.env.local

# Backend
cp server/.env.example server/.env
```

Fill in the required API keys, database URL, and sync schedule configuration.

### Run in development

```bash
# Frontend — http://localhost:3000
cd client && pnpm dev

# Backend — http://localhost:5000
cd server && pnpm dev
```

---

## Deployment

Both apps deploy independently on the same VPS:

- `client` builds as a standalone Next.js app served on port 3000
- `server` runs as a Node.js process on port 5000
- Nginx reverse proxies public traffic — `/api/*` routes to Express, all other routes to Next.js
- Data sync jobs run on a scheduled cron twice daily (morning and evening)

---

## Project Phases

See [plan.md](./plan.md) for the full product plan, client requirements, and design philosophy.

---

## License

Private and proprietary. Not for public distribution.
