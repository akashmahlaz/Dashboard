# Event Ticketing Dashboard — Copilot Instructions

This is a private monorepo for an internal event operations dashboard.
`client/` is Next.js 16. `server/` is Express 5. Database is PostgreSQL via Supabase.

Always read `plan.md` at the root before starting any work session.
It is the single source of truth for what is built, what is in progress, and what is next.

---

## Plan Awareness

- Before every task, check `plan.md` to understand current phase, what has been done, how it was done, and what mindset was used.
- After every task, update `plan.md` to reflect what was completed and any decisions made.
- Never build something that contradicts the plan without flagging it explicitly.

---

## Git Discipline

- After every successful piece of work: `git add`, `git commit`, `git push`.
- Successful means the work has been **double-tested** — run it, verify the output, check edge cases.
- Commit messages must be specific and describe the actual change, not "update" or "fix."
- Never push broken code. If tests or build fail, fix first, then push.
- Always work on the correct branch. Check `git branch` before starting. Never commit directly to `main` without confirmation.

---

## Code Quality — Non-Negotiable Rules

1. **After writing or editing any TypeScript file, always run `pnpm exec tsc --noEmit` to verify correctness.** Fix all type errors before proceeding.
2. **Never run `pnpm build` or `pnpm lint` unless the user explicitly asks.** Type checking via `tsc --noEmit` is sufficient during development.
3. **No file should exceed ~200 lines.** If it does, it must be split.
2. **Aggressively divide into components.** One concern per file. One job per component.
3. **No barrel-of-logic files.** Extract hooks, utils, types, and constants into their own files.
4. **Long-term manageable code only.** Write as if someone else inherits this codebase tomorrow.
5. **No clever code.** Readable beats clever. Explicit beats magic.
6. **Types everywhere** in TypeScript. No `any`. No implicit returns without types.
7. **No hardcoded values** in components — constants live in `lib/constants.ts` or co-located `constants.ts`.

---

## Component Architecture (Frontend)

```
client/
  app/                  # Route segments only — no logic here
  components/
    ui/                 # shadcn base components (auto-generated, do not hand-edit)
    dashboard/          # Dashboard-specific compositions
    events/             # Event-related components
    shared/             # Reusable across features
  lib/
    api/                # API client functions (one file per resource)
    hooks/              # Custom React hooks
    utils/              # Pure utility functions
    constants.ts        # App-wide constants
    types.ts            # Shared TypeScript types
```

- Every page in `app/` is a thin shell — it imports a page-level component from `components/`.
- Page components import smaller feature components. Feature components import atoms from `components/ui/` or `components/shared/`.
- No component file does data fetching AND rendering AND business logic at once — split them.

---

## shadcn/ui Rules

- **Use every shadcn component that fits the use case.** Do not reach for custom HTML when a shadcn primitive exists.
- Before building any UI element, ask: does shadcn have this? Table, Card, Badge, Tabs, Select, DatePicker, Popover, Sheet, Skeleton, Separator, Alert, Toast — all of these must come from shadcn.
- If a shadcn component is missing from `client/components/ui/`, run `pnpm dlx shadcn@latest add <component>` to add it. Do not replicate it by hand.
- Override and compose shadcn — never accept the default look unchanged. Adjust tokens, spacing, and typography to match the design system.
- Reference shadcn dashboard blocks: `dashboard-01`, `sidebar-07`, `sidebar-08` — study their layout patterns before building any dashboard shell.

---

## UI Library Stack

Use the following strategically — each component earns its place:

| Library | Use For |
|---|---|
| shadcn/ui | Base primitives, layout, forms, tables, navigation |
| Magic UI | Subtle motion (counters, transitions) — use sparingly |
| Kokonut UI | Specialty display components where shadcn has no equivalent |

Never use all three for the same thing. Pick the best fit per component, not per preference.

---

## Design Rules — Enforced on Every UI Task

**NEVER:**
- Dark theme. This product is light-mode only.
- Flashy gradients, glow effects, animated blobs, or decorative noise.
- Generic out-of-the-box component look. Always adapt.
- Packed layouts — whitespace is a first-class design element.
- Dashboard components that look like a SaaS landing page demo.

**ALWAYS:**
- Editorial, data-forward UI. Tables and numbers are the hero.
- Light background, controlled contrast, muted tones with purposeful accent.
- Color communicates meaning only: green = positive delta, amber = warning, red = critical, blue = informational.
- Typography sets the tone — use scale and weight deliberately (see Typography section).
- Every visual decision should have a reason tied to data clarity or user task.

---

## Typography System

- **Reference:** Study the JustBeCause repo at `https://github.com/akashmahlaz/justbecuase` for typography discipline, spacing rhythm, and font pairing before implementing any type system.
- Font pairing: one high-quality sans-serif for UI + one geometric or editorial face for numbers/headings.
- Define all type styles as Tailwind utilities or CSS variables — never inline `text-[14px]` one-offs.
- Type scale must be consistent: headings, subheadings, body, caption, label, number — each has one style and one style only.
- Numbers in tables: tabular figures (`font-variant-numeric: tabular-nums`), right-aligned, monospaced weight.

---

## JustBeCause Reference Dashboard

URL: `https://github.com/akashmahlaz/justbecuase`

Before implementing any of the following, study JustBeCause:
- Page layout and sidebar structure
- Navigation patterns and active states
- Card and data component composition
- Typography rhythm and whitespace usage
- How dense data is made readable

You may clone relevant files temporarily for study. Extract patterns, do not copy code.

---

## After-Work Report (Required After Every Task)

After completing any meaningful task, provide this report in your response:

```
## Work Report

### What was done
[Specific changes made, files created/modified]

### How it was tested
[Steps taken to verify correctness]

### What can be improved
[Honest assessment — not placeholders]

### What is next
[Next logical task from plan.md]

### plan.md status
[What phase we are in, what is done, what remains]
```

---

## Server Architecture (Express)

```
server/
  src/
    routes/           # One file per resource (events.ts, sales.ts, sync.ts)
    jobs/             # Sync jobs (ticketing.ts, meta.ts)
    db/               # Query files per table, schema migrations
    middleware/       # Auth, error handling, request logging
    utils/            # Pure utilities
    types/            # Shared TypeScript types
  index.ts            # App entry — only wires middleware and routes
```

- Routes only call service functions — no DB logic in route handlers.
- Jobs are pure functions that can be called by cron or by an API trigger.
- All DB access is via parameterized queries — never string interpolation in SQL.
- All sync jobs log to `sync_runs` table with status, duration, and error detail.

---

## Data Sync Rules

- Sync runs twice daily: morning (07:00) and evening (19:00).
- All syncs are idempotent upserts — safe to re-run.
- Every sync job records its run in `sync_runs` (started_at, finished_at, status, error_summary).
- Failed syncs must surface as visible UI warnings on the dashboard — never silent failures.
- Manual sync trigger endpoint must exist and be accessible from admin UI.
