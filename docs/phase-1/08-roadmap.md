# 08 — Phased Delivery Roadmap

Incremental build plan. Each phase ends with a **review gate** before the next begins.

---

## Overview

| Phase | Focus | Deliverable | Est. scope |
|-------|-------|-------------|------------|
| **1** | Planning | Architecture, schema, flows | ✅ Current |
| **2** | Foundation | Supabase, auth, DB migrations | ~3–5 days |
| **3** | Shell & Dashboard | Layout, nav, dashboard widgets | ~4–6 days |
| **4** | Tasks | Full task management | ~7–10 days |
| **5** | Calendar & Habits | Calendar views + habit tracker | ~5–7 days |
| **6** | Goals & Expenses | Goals, transactions, budgets | ~6–8 days |
| **7** | Notes, Analytics, Reports | Notes editor, charts, reports | ~7–9 days |
| **8** | Polish & Data | Settings, import/export, UX polish | ~4–6 days |
| **9** | Production | PWA, performance, testing, deploy | ~5–7 days |

---

## Phase 1 — Planning ✅

**Status:** Complete — awaiting approval

- [x] Product architecture
- [x] Folder structure
- [x] Feature list
- [x] Database schema (23 tables)
- [x] ER diagram
- [x] User flows
- [x] UI sitemap
- [x] Roadmap

**Gate:** User approval

---

## Phase 2 — Foundation

**Goal:** Runnable app with auth and database

### Tasks
1. Initialize Vite + React + TypeScript project
2. Configure Tailwind, shadcn/ui, path aliases
3. Create Supabase project (or connect existing)
4. Run SQL migrations (enums → profiles → all tables → RLS → storage)
5. Implement auth:
   - Email login/register
   - Google + GitHub OAuth
   - Forgot/reset password
   - Email verification UI
   - `useAuth` hook + `AuthGuard`
6. Profile creation trigger + default categories seed
7. Avatar upload to Storage
8. Basic protected route shell (placeholder pages)

### Acceptance criteria
- User can register, verify email, log in/out
- OAuth works for Google and GitHub
- Profile row created automatically
- Avatar upload updates `profiles.avatar_url`
- RLS blocks cross-user data access

**Gate:** User approval

---

## Phase 3 — UI Layout & Dashboard

**Goal:** Premium app shell with functional dashboard

### Tasks
1. Design tokens + theme provider (light/dark/system)
2. AppShell: sidebar, header, mobile nav
3. shadcn/ui component library setup
4. Dashboard page with widgets:
   - Today's tasks (from DB)
   - Overdue tasks
   - Upcoming deadlines
   - Quick add task
   - Weekly/monthly progress charts (Recharts)
   - Recent activity feed
   - Placeholder widgets for habits/expenses/goals
5. Settings: appearance + profile pages (basic)
6. Loading skeletons + empty states
7. Framer Motion page transitions

### Acceptance criteria
- Responsive on mobile, tablet, desktop
- Theme toggle works globally
- Dashboard loads real task data (minimal CRUD for quick-add)
- Navigation between all main routes (placeholder content OK)

**Gate:** User approval

---

## Phase 4 — Task Management

**Goal:** Production-quality task module

### Tasks
1. Full task CRUD API layer
2. List, Kanban, Table, Calendar views
3. Task detail slide-over panel
4. Checklist, subtasks, dependencies
5. Tags, categories, filters, search, sort, group
6. Priorities, statuses, recurrence
7. Bulk actions, archive, trash
8. File attachments (Storage)
9. dnd-kit for Kanban + reorder
10. Realtime subscription for task lists
11. Activity log triggers

### Acceptance criteria
- All task views functional with real data
- Drag-and-drop updates persist
- Filters and search work across views
- Soft delete + restore from trash

**Gate:** User approval

---

## Phase 5 — Calendar & Habits

**Goal:** Unified calendar + habit tracking

### Tasks
1. Calendar: month, week, day, agenda views
2. Calendar events CRUD + recurrence
3. Merge task deadlines into calendar
4. Drag-and-drop reschedule
5. Habits CRUD + check-in
6. Streak calculation
7. Heatmap component
8. Dashboard habit widget (live data)

### Acceptance criteria
- Tasks and events appear on calendar
- Habit check-in updates streaks
- Heatmap renders 90-day history

**Gate:** User approval

---

## Phase 6 — Goals & Expenses

**Goal:** Financial tracking + goal progress

### Tasks
1. Goals CRUD + milestones
2. Link tasks to goals, auto progress
3. Transactions: income, expense, transfer
4. Categories + payment methods
5. Budgets with progress bars
6. Receipt upload
7. Recurring transactions
8. Dashboard expense widgets
9. Goal progress widget

### Acceptance criteria
- Complete expense flow with budgets
- Goal progress updates when linked tasks complete
- Monthly spending visible on dashboard

**Gate:** User approval

---

## Phase 7 — Notes, Analytics & Reports

**Goal:** Knowledge base + insights

### Tasks
1. Tiptap note editor (rich text, markdown, code, images)
2. Folders, tags, search
3. Analytics page: productivity score, all charts
4. Reports: weekly, monthly, yearly
5. DB views for analytics aggregates
6. Dashboard charts fully live

### Acceptance criteria
- Notes auto-save with rich formatting
- Full-text search returns results
- Analytics charts reflect real data
- Reports generate for selected periods

**Gate:** User approval

---

## Phase 8 — Polish & Data Management

**Goal:** Settings complete, import/export, UX refinement

### Tasks
1. Full settings (timezone, currency, notifications UI)
2. Export all data as JSON
3. Import JSON with validation
4. Command palette (⌘K) — optional
5. Global search — optional
6. Keyboard shortcuts
7. Onboarding tour
8. Error boundary improvements
9. Accessibility audit fixes

### Acceptance criteria
- Round-trip export/import works
- All settings persist and apply
- No critical a11y violations

**Gate:** User approval

---

## Phase 9 — Production Ready

**Goal:** Deployable, tested, performant

### Tasks
1. Vitest unit tests for utils and hooks
2. Playwright E2E for auth + critical flows
3. Bundle analysis + code splitting audit
4. Lighthouse performance pass
5. PWA manifest + service worker (optional)
6. CI/CD pipeline (GitHub Actions)
7. Environment docs + README
8. Production Supabase project setup
9. Deploy frontend (Vercel/Netlify)
10. Error monitoring setup (Sentry — optional)

### Acceptance criteria
- Deployed URL accessible
- Core flows pass E2E tests
- Lighthouse performance > 90
- README with setup instructions

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Scope creep | Strict phase gates; V2 features deferred |
| Recurrence complexity | JSON RRULE + client expansion; no server cron |
| Rich text XSS | DOMPurify sanitization |
| Large task lists | Virtual scrolling + pagination |
| Analytics performance | DB views + query caching |
| OAuth config | Document provider setup in Phase 2 README |

---

## What we need from you

1. **Approve Phase 1** (or request changes)
2. **Supabase project** — create one at [supabase.com](https://supabase.com) or provide existing credentials for Phase 2
3. **OAuth apps** — Google Cloud Console + GitHub OAuth app (Phase 2)
4. **Branding** — confirm app name "Nexora" and preferred accent color (default: indigo/violet gradient)
5. **Font preference** — Inter (default) or Geist

---

**Next step:** Upon your approval, Phase 2 begins with project scaffolding and Supabase integration.
