# Nexora — Phase 1: Product Architecture & Planning

> **Status:** Awaiting approval before Phase 2 (Supabase setup, auth, migrations)

Nexora is a premium personal productivity platform unifying tasks, calendar, habits, goals, expenses, and notes into one cohesive experience — inspired by Notion, TickTick, Todoist, Linear, Google Calendar, and Money Manager.

---

## Documents in this phase

| Document | Description |
|----------|-------------|
| [01-product-architecture.md](./01-product-architecture.md) | System design, tech decisions, feature modules |
| [02-folder-structure.md](./02-folder-structure.md) | Frontend/backend folder layout |
| [03-feature-list.md](./03-feature-list.md) | Complete feature inventory by module |
| [04-database-schema.md](./04-database-schema.md) | PostgreSQL schema, RLS, indexes |
| [05-er-diagram.md](./05-er-diagram.md) | Entity-relationship diagram |
| [06-user-flows.md](./06-user-flows.md) | Key user journeys |
| [07-ui-sitemap.md](./07-ui-sitemap.md) | Navigation structure & screen inventory |
| [08-roadmap.md](./08-roadmap.md) | Phased delivery plan (Phase 2+) |

---

## Executive summary

### Vision
A single workspace where productivity data is interconnected — tasks link to goals, expenses tie to budgets, habits feed analytics, and the dashboard surfaces what matters today.

### Core principles
1. **Supabase-only backend** — Auth, Postgres, RLS, Storage, Realtime; Edge Functions only when unavoidable
2. **Feature-based frontend** — Each domain (tasks, calendar, etc.) is self-contained
3. **Premium UX** — Apple-quality polish, dark/light themes, Framer Motion, glassmorphism accents
4. **Multi-tenant by design** — Every table scoped to `user_id` with RLS
5. **Incremental delivery** — Ship usable slices per phase, not a monolith

### Tech stack (confirmed)

| Layer | Choice |
|-------|--------|
| Build | Vite + React 19 + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v7 |
| Data | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Charts | Recharts |
| DnD | @dnd-kit (preferred over react-dnd — better a11y, maintained) |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |

---

## Approval checklist

Before Phase 2, please confirm:

- [ ] Overall architecture approach
- [ ] Folder structure conventions
- [ ] Database schema & table design
- [ ] ER diagram relationships
- [ ] User flows cover primary journeys
- [ ] UI sitemap & navigation model
- [ ] Phased roadmap & priorities

**Reply with approval or requested changes to proceed to Phase 2.**
