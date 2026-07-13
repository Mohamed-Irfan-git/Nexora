# 01 — Product Architecture

## 1. High-level system architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (SPA)                              │
│  React + Vite + TypeScript                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Features │ │  Shared  │ │   UI     │ │  Lib     │          │
│  │ (domain) │ │  hooks   │ │ shadcn   │ │ supabase │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       └────────────┴────────────┴────────────┘                   │
│                         TanStack Query                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (REST + Realtime WS)
┌────────────────────────────▼────────────────────────────────────┐
│                      SUPABASE PLATFORM                           │
│  ┌─────────┐ ┌──────────────┐ ┌─────────┐ ┌──────────┐         │
│  │  Auth   │ │  PostgreSQL  │ │ Storage │ │ Realtime │         │
│  │ OAuth   │ │  + RLS       │ │ Avatars │ │ Tasks    │         │
│  │ Email   │ │  Migrations  │ │ Receipts│ │ Activity │         │
│  └─────────┘ └──────────────┘ └─────────┘ └──────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

No custom Node/Python server. Business logic lives in:
- **Client** — validation, UI state, optimistic updates
- **Postgres** — constraints, triggers for `updated_at`, computed views
- **RLS policies** — authorization
- **Edge Functions** — only for: email webhooks, complex exports, or third-party integrations (deferred to later phases)

---

## 2. Application layers (frontend)

```
src/
├── app/           # Bootstrap: providers, router, theme
├── features/      # Domain modules (tasks, calendar, …)
├── components/    # Shared UI (layout, empty states, charts)
├── hooks/         # Cross-feature hooks
├── lib/           # Supabase client, utils, constants
├── types/         # Shared TypeScript types
└── styles/        # Global CSS, design tokens
```

### Feature module internal structure

Each feature follows the same pattern:

```
features/tasks/
├── api/           # Supabase queries & mutations
├── components/    # Feature-specific UI
├── hooks/         # useTasks, useTaskFilters, etc.
├── schemas/       # Zod schemas
├── types/         # Task, TaskStatus, etc.
├── utils/         # Pure helpers
└── index.ts       # Public exports
```

**Why feature-based?** Scales to 10+ domains without cross-import spaghetti. Teams can own a feature folder. Tree-shaking keeps bundles lean.

---

## 3. Data flow pattern

```
User Action → React Component → TanStack Mutation/Query
    → Supabase Client (typed) → PostgreSQL (RLS enforces user_id)
    → Cache invalidation → Optimistic UI update → Re-render
```

### Caching strategy
| Data type | Stale time | Realtime |
|-----------|------------|----------|
| User profile / settings | 5 min | No |
| Tasks, habits, expenses | 30 sec | Yes (lists) |
| Dashboard aggregates | 1 min | Invalidate on mutation |
| Notes content | 0 (on focus) | Optional later |
| Analytics | 5 min | No |

### Optimistic updates
Used for: task status toggle, habit check-in, quick-add task/expense. Roll back on error with toast.

---

## 4. Authentication architecture

| Method | Provider |
|--------|----------|
| Email + password | Supabase Auth |
| Google OAuth | Supabase Auth |
| GitHub OAuth | Supabase Auth |
| Email verification | Supabase built-in |
| Password reset | Supabase built-in |
| Avatar upload | Supabase Storage → `avatars/{user_id}/` |

### Auth flow
1. User signs up → `auth.users` row created
2. Trigger `on_auth_user_created` → insert `profiles` row
3. JWT contains `auth.uid()` → all RLS policies use this
4. Protected routes via `AuthGuard` + redirect to `/login`

### Session handling
- `@supabase/ssr` pattern adapted for SPA (persist session in localStorage)
- Auto-refresh tokens
- `useAuth()` hook exposes user, profile, signIn/signOut

---

## 5. Multi-module integration points

Modules share data through **relational links**, not duplicate stores:

| Link | Mechanism |
|------|-----------|
| Task → Goal | `tasks.goal_id` FK |
| Task → Calendar | `tasks.start_date`, `deadline` surfaced in calendar views |
| Task → Habit | Optional `tasks.habit_id` for habit-derived tasks |
| Expense → Budget | `expenses.category_id` + `budgets` table |
| Note → Task | `note_links` polymorphic junction |
| Activity feed | `activity_log` table (trigger-based inserts) |
| Dashboard | Materialized views or client-side aggregation (Phase 3+) |

### Unified search (Phase 7+)
Postgres full-text search across `tasks`, `notes`, `goals` via `search_index` view or Supabase `textSearch`.

---

## 6. Design system architecture

### Theme
- CSS variables in `globals.css` (shadcn convention)
- `next-themes` or custom `ThemeProvider` for light/dark/system
- Semantic tokens: `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--accent`, `--destructive`

### Visual language
| Element | Treatment |
|---------|-----------|
| Cards | `rounded-2xl`, subtle border, `shadow-sm` / `shadow-md` on hover |
| Sidebar | Glassmorphism: `backdrop-blur-xl bg-background/80` |
| Typography | Inter or Geist (via `@fontsource`) — clean, Linear-inspired |
| Spacing | 4px grid; generous padding on desktop |
| Motion | Framer Motion page transitions, list stagger, modal spring |
| Charts | Recharts with theme-aware colors |

### Responsive breakpoints
- Mobile: `< 768px` — bottom nav, collapsible sidebar
- Tablet: `768–1024px` — icon sidebar
- Desktop: `> 1024px` — full sidebar + multi-column layouts

---

## 7. Security model

| Concern | Solution |
|---------|----------|
| Authorization | RLS on every table: `user_id = auth.uid()` |
| File uploads | Storage policies: user can only CRUD own folder |
| Input validation | Zod on client + CHECK constraints in DB |
| XSS (notes) | Sanitize rich text (DOMPurify) before render |
| CSRF | Supabase handles via JWT |
| Soft delete | `deleted_at` column; RLS hides deleted by default |

---

## 8. Performance strategy

- **Code splitting** — React.lazy per route/feature
- **Virtual lists** — `@tanstack/react-virtual` for long task lists
- **Indexes** — composite indexes on `(user_id, status)`, `(user_id, deadline)`, etc.
- **Pagination** — cursor-based for activity log, offset for tables
- **Image optimization** — WebP avatars, max upload size 2MB
- **Bundle** — analyze with `rollup-plugin-visualizer` in CI (later)

---

## 9. Error & loading UX

| State | Pattern |
|-------|---------|
| Loading | Skeleton components matching layout |
| Empty | Illustrated empty states with CTA |
| Error | Toast + inline retry; error boundary per route |
| Offline | Banner + queue mutations (Phase 8+) |

---

## 10. Key architectural decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| DnD library | **dnd-kit** | Active maintenance, accessibility, touch support |
| Recurrence | **RFC 5545-inspired JSON** in `repeat_rule` column | Flexible without external cron; client expands instances |
| Rich notes | **Tiptap** editor | Extensible, Markdown-friendly, production-proven |
| IDs | **UUID v4** | Supabase default, safe for client-generated IDs |
| Timestamps | **timestamptz** | Timezone-aware; user timezone in profile |
| Soft delete | Tasks, notes, goals, expenses | Trash/archive UX |
| Activity log | DB triggers | Consistent audit trail without client bugs |
| Edge Functions | Defer | YAGNI until export/import or webhooks needed |

---

## 11. Deployment (future phases)

| Component | Target |
|-----------|--------|
| Frontend | Vercel / Netlify / Cloudflare Pages |
| Supabase | Hosted Supabase project |
| Env vars | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Migrations | `supabase db push` via CLI |

---

## 12. Testing strategy (future)

| Layer | Tool |
|-------|------|
| Unit | Vitest |
| Components | Testing Library |
| E2E | Playwright |
| DB policies | Supabase local + pgTAP (optional) |
