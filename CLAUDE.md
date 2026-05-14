# CLAUDE.md — Event Ticketing Dashboard

This is a private monorepo for an internal event operations dashboard.

- `client/` → Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- `server/` → Express 5, Node.js, TypeScript
- Database → PostgreSQL via Supabase
- UI Stack → shadcn/ui + Magic UI + Kokonut UI

---

## First Thing Every Session

1. Read `plan.md` at the root.
2. Understand what phase we are in, what is complete, and what is next.
3. Check `git branch` — confirm you are on the correct branch before writing any code.
4. Never start work without knowing the current plan state.

---

## Git Workflow — Mandatory

After every successful, verified piece of work:

```bash
git add .
git commit -m "<specific description of what changed and why>"
git push
```

**Definition of "successful":**
- The work runs without errors.
- You have double-checked the output — visually or via test.
- Edge cases have been considered.
- If it touches the database or an API, the data returned is verified correct.

**Commit message rules:**
- Be specific: `feat(events): add daily sales table with date filter` not `update table`
- Use conventional commits: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`
- Never commit with a generic message.

**Branch rules:**
- Always check `git branch` before starting.
- Never commit to `main` without explicit confirmation.
- Feature work goes on a descriptive branch.

---

## Plan.md Discipline

- `plan.md` is the source of truth for what this product is, what is done, and what is next.
- After completing a task, update `plan.md`:
  - Mark completed items clearly.
  - Add any new decisions, constraints, or patterns discovered.
  - Note what mindset or approach was used.
- If you are about to build something not in `plan.md`, stop and confirm first.

---

## Code Quality — Hard Rules

1. **200-line limit per file.** Split before you hit it, not after.
2. **Aggressive component splitting.** One job per file. One concern per component.
3. **No logic in page files.** `app/` pages are shells — they import from `components/`.
4. **No business logic in components.** Extract to hooks or service functions.
5. **No `any` in TypeScript.** Ever.
6. **No hardcoded strings or numbers in components.** Use constants.
7. **No commented-out dead code.** Delete it — git remembers it.
8. **Long-term maintainability over short-term convenience.** Always.

---

## Frontend Component Structure

```
client/
  app/                        # Route segments — thin shells only
  components/
    ui/                       # shadcn components (do not hand-edit)
    dashboard/                # Dashboard layout compositions
    events/                   # Event-specific feature components
    shared/                   # Cross-feature reusables
  lib/
    api/                      # One file per API resource
    hooks/                    # Custom hooks — one per concern
    utils/                    # Pure utility functions
    constants.ts
    types.ts
```

When in doubt about where something lives: "could this be used in two different features?" → `shared/`. "Is this only for events?" → `events/`.

---

## shadcn/ui — Required Approach

- **Use shadcn for every UI primitive that exists in the library.**
- Check `client/components/ui/` before building anything. If the component is not there, add it:
  ```bash
  cd client && pnpm dlx shadcn@latest add <component-name>
  ```
- Components you must add if missing: Table, Card, Badge, Tabs, Select, Popover, Sheet, Skeleton, Separator, Alert, Toaster, DatePicker, Dialog, DropdownMenu, Command, Tooltip, Progress, Avatar, ScrollArea.
- Always study shadcn blocks before building a layout:
  - `dashboard-01` for the main dashboard shell.
  - `sidebar-07` or `sidebar-08` for the navigation sidebar.
  - Adapt them — never use them verbatim.
- Override shadcn defaults via CSS variables and Tailwind config — never accept the out-of-the-box look.

---

## UI Library Usage

| Library | When to Use |
|---|---|
| shadcn/ui | All base primitives, layout, forms, tables, navigation, feedback |
| Magic UI | Subtle motion — number counters, smooth transitions — use sparingly |
| Kokonut UI | Specialty display components with no shadcn equivalent |

Do not use two libraries for the same purpose. Choose one per component type.

---

## Design Rules — No Exceptions

**FORBIDDEN:**
- Dark theme. Light mode only, always.
- Gradients as decoration. Glow effects. Animated backgrounds. Blobs.
- Generic default component appearance without customization.
- Dense cluttered layouts that ignore whitespace.
- UI that looks like a SaaS demo or template.

**REQUIRED:**
- Editorial, data-forward layout. Numbers and tables are the visual hero.
- Whitespace is a design element — use it deliberately.
- Color communicates meaning only:
  - Green → positive trend / active
  - Amber → warning / attention needed
  - Red → critical / error
  - Blue/Slate → informational / neutral
- Consistent visual hierarchy — size and weight difference must be intentional.
- Hover and focus states on every interactive element.

---

## Typography Rules

- Study `https://github.com/akashmahlaz/justbecuase` for typography discipline before implementing any type system.
- Use a proper font pair: one sans-serif for UI body, one for display/headings or data numbers.
- Define all type styles in one place (Tailwind tokens or CSS variables). No one-off inline sizes.
- Numbers in tables: use `font-variant-numeric: tabular-nums`, right-aligned, consistent weight.
- Type scale levels: `display`, `heading`, `subheading`, `body`, `label`, `caption`, `number` — define all six, use them consistently.

---

## JustBeCause Reference

URL: `https://github.com/akashmahlaz/justbecuase`

Before implementing any of these, study this repo:
- Dashboard layout, sidebar, and navigation patterns
- Typography scale, font pairing, and whitespace rhythm
- How data-dense views are made readable
- Component composition — how small parts build larger views
- Active state, hover state, and focus state design

You may clone relevant files temporarily to study patterns. Extract the approach, do not copy the code.

---

## Backend Structure (Express)

```
server/
  src/
    routes/           # One route file per resource
    jobs/             # Sync jobs — ticketing.ts, meta.ts (Phase 2)
    db/               # SQL queries per table, schema files
    middleware/        # Error handler, request logger, auth
    utils/
    types/
  index.ts            # Entry point — wires middleware + routes only
```

Rules:
- Route handlers call service functions only — zero DB logic in routes.
- All SQL is parameterized. No string concatenation in queries.
- Sync jobs are pure, independently callable functions.
- Every sync logs to `sync_runs`.
- API errors return structured JSON: `{ error: string, code: string }`.

---

## After Every Task — Required Report

```
## Work Report

### What was done
<specific files created/modified and why>

### How it was tested
<steps taken — not "I tested it" — be specific>

### What can be improved
<honest, actionable list — not placeholder text>

### What is next (from plan.md)
<next logical step>

### plan.md status
<current phase, what is complete, what remains>
```

---

## Security Reminders

- No secrets in code. All credentials via environment variables.
- No SQL string interpolation — parameterized queries only.
- Input validation at every API boundary.
- CORS configured explicitly on Express — not `origin: *` in production.
- HTTP-only cookies for any session tokens.
