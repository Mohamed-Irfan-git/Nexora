# 02 — Folder Structure

## Repository root

```
nexora/
├── docs/
│   └── phase-1/              # Planning docs (this phase)
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── styles/
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   ├── migrations/           # SQL migration files
│   ├── seed.sql              # Dev seed data (optional)
│   └── config.toml
├── .env.example
├── .gitignore
├── components.json           # shadcn/ui config
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## `src/app/` — Application shell

```
app/
├── App.tsx                   # Root component
├── router.tsx                # React Router route definitions
├── providers.tsx             # QueryClient, Theme, Auth, Tooltip providers
└── routes/
    ├── public.routes.tsx     # /login, /register, /forgot-password
    ├── protected.routes.tsx  # Authenticated app routes
    └── index.ts
```

---

## `src/features/` — Domain modules

```
features/
├── auth/
│   ├── api/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── OAuthButtons.tsx
│   │   └── AuthLayout.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── schemas/
│   └── types/
│
├── dashboard/
│   ├── api/
│   ├── components/
│   │   ├── DashboardPage.tsx
│   │   ├── TodaysTasksWidget.tsx
│   │   ├── UpcomingDeadlinesWidget.tsx
│   │   ├── HabitStreaksWidget.tsx
│   │   ├── ExpenseSummaryWidget.tsx
│   │   ├── GoalProgressWidget.tsx
│   │   ├── CalendarWidget.tsx
│   │   ├── QuickAddBar.tsx
│   │   └── RecentActivityFeed.tsx
│   └── hooks/
│
├── tasks/
│   ├── api/
│   │   ├── tasks.api.ts
│   │   ├── subtasks.api.ts
│   │   └── task-attachments.api.ts
│   ├── components/
│   │   ├── TaskListView.tsx
│   │   ├── TaskKanbanView.tsx
│   │   ├── TaskTableView.tsx
│   │   ├── TaskCalendarView.tsx
│   │   ├── TaskTimelineView.tsx
│   │   ├── TaskDetailPanel.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskFilters.tsx
│   │   └── TaskBulkActions.tsx
│   ├── hooks/
│   ├── schemas/
│   ├── types/
│   └── utils/
│       └── recurrence.ts
│
├── calendar/
│   ├── api/
│   ├── components/
│   │   ├── CalendarPage.tsx
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   ├── DayView.tsx
│   │   ├── AgendaView.tsx
│   │   └── EventForm.tsx
│   └── hooks/
│
├── habits/
│   ├── api/
│   ├── components/
│   │   ├── HabitsPage.tsx
│   │   ├── HabitCard.tsx
│   │   ├── HabitHeatmap.tsx
│   │   └── HabitForm.tsx
│   └── hooks/
│
├── goals/
│   ├── api/
│   ├── components/
│   │   ├── GoalsPage.tsx
│   │   ├── GoalCard.tsx
│   │   ├── MilestoneList.tsx
│   │   └── GoalForm.tsx
│   └── hooks/
│
├── expenses/
│   ├── api/
│   ├── components/
│   │   ├── ExpensesPage.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── BudgetCard.tsx
│   │   ├── CategoryPicker.tsx
│   │   └── ExpenseCharts.tsx
│   └── hooks/
│
├── notes/
│   ├── api/
│   ├── components/
│   │   ├── NotesPage.tsx
│   │   ├── NoteEditor.tsx      # Tiptap wrapper
│   │   ├── NoteSidebar.tsx
│   │   └── FolderTree.tsx
│   └── hooks/
│
├── analytics/
│   ├── api/
│   ├── components/
│   │   ├── AnalyticsPage.tsx
│   │   ├── ProductivityScore.tsx
│   │   └── TrendCharts.tsx
│   └── hooks/
│
├── reports/
│   ├── api/
│   ├── components/
│   │   └── ReportsPage.tsx
│   └── hooks/
│
└── settings/
    ├── api/
    ├── components/
    │   ├── SettingsPage.tsx
    │   ├── ProfileSettings.tsx
    │   ├── AppearanceSettings.tsx
    │   ├── NotificationSettings.tsx
    │   └── DataSettings.tsx    # Import/export
    └── hooks/
```

---

## `src/components/` — Shared UI

```
components/
├── layout/
│   ├── AppShell.tsx            # Sidebar + header + main
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── MobileNav.tsx
│   ├── PageHeader.tsx
│   └── CommandPalette.tsx      # ⌘K global search (later)
│
├── ui/                         # shadcn/ui primitives (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── skeleton.tsx
│   ├── toast.tsx
│   └── ...
│
├── feedback/
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── LoadingSkeleton.tsx
│   └── ConfirmDialog.tsx
│
├── data-display/
│   ├── StatCard.tsx
│   ├── ProgressRing.tsx
│   ├── BadgePriority.tsx
│   ├── BadgeStatus.tsx
│   └── DataTable.tsx
│
└── charts/
    ├── AreaChart.tsx
    ├── BarChart.tsx
    ├── DonutChart.tsx
    └── ChartContainer.tsx      # Theme-aware Recharts wrapper
```

---

## `src/lib/` — Utilities & clients

```
lib/
├── supabase/
│   ├── client.ts               # createClient()
│   ├── types.ts                # Generated Database types
│   └── storage.ts              # Upload helpers
├── utils/
│   ├── cn.ts                   # clsx + tailwind-merge
│   ├── date.ts                 # date-fns wrappers
│   ├── currency.ts
│   └── format.ts
├── constants/
│   ├── routes.ts
│   ├── priorities.ts
│   └── task-statuses.ts
└── query-client.ts             # TanStack Query defaults
```

---

## `src/hooks/` — Cross-feature hooks

```
hooks/
├── useMediaQuery.ts
├── useDebounce.ts
├── useLocalStorage.ts
├── useTheme.ts
└── useRealtimeSubscription.ts
```

---

## `supabase/migrations/` — Database

```
migrations/
├── 00001_extensions_and_enums.sql
├── 00002_profiles_and_settings.sql
├── 00003_tasks.sql
├── 00004_calendar_events.sql
├── 00005_habits.sql
├── 00006_goals.sql
├── 00007_expenses.sql
├── 00008_notes.sql
├── 00009_tags_and_categories.sql
├── 00010_activity_log.sql
├── 00011_storage_buckets.sql
└── 00012_rls_policies.sql      # Or inline RLS per migration
```

Migrations are ordered and idempotent. Each creates tables + indexes + RLS for that domain.

---

## Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TaskKanbanView.tsx` |
| Hooks | camelCase, `use` prefix | `useTasks.ts` |
| API files | kebab-case + `.api.ts` | `tasks.api.ts` |
| DB tables | snake_case, plural | `task_dependencies` |
| Types | PascalCase | `Task`, `TaskPriority` |
| Routes | kebab-case | `/tasks/kanban` |
| CSS | Tailwind utilities only | No CSS modules |

---

## Import aliases (tsconfig)

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/features/*": ["./src/features/*"],
    "@/components/*": ["./src/components/*"],
    "@/lib/*": ["./src/lib/*"]
  }
}
```
