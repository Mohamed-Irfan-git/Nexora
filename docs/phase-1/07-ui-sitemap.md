# 07 — UI Sitemap

Complete screen inventory, route map, and navigation structure.

---

## Route map

### Public routes (unauthenticated)

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | Redirect | → `/dashboard` if authed, else `/login` |
| `/login` | Login | Email + OAuth buttons |
| `/register` | Register | Sign up form |
| `/forgot-password` | Forgot password | Email input |
| `/reset-password` | Reset password | New password form (from email link) |
| `/verify-email` | Email verification | Confirmation / resend |

### Protected routes (authenticated)

| Route | Screen | Layout |
|-------|--------|--------|
| `/dashboard` | Dashboard | AppShell |
| `/tasks` | Tasks (default: list) | AppShell |
| `/tasks/list` | Task list view | AppShell |
| `/tasks/kanban` | Kanban board | AppShell |
| `/tasks/table` | Table view | AppShell |
| `/tasks/calendar` | Task calendar view | AppShell |
| `/tasks/timeline` | Timeline view (V2) | AppShell |
| `/tasks/:id` | Task detail (panel or page) | AppShell |
| `/tasks/archive` | Archived tasks | AppShell |
| `/tasks/trash` | Deleted tasks | AppShell |
| `/calendar` | Calendar (month default) | AppShell |
| `/calendar/week` | Week view | AppShell |
| `/calendar/day` | Day view | AppShell |
| `/calendar/agenda` | Agenda view | AppShell |
| `/habits` | Habits overview | AppShell |
| `/habits/:id` | Habit detail + heatmap | AppShell |
| `/goals` | Goals list | AppShell |
| `/goals/:id` | Goal detail + milestones | AppShell |
| `/expenses` | Expenses overview | AppShell |
| `/expenses/transactions` | Transaction list | AppShell |
| `/expenses/budgets` | Budget management | AppShell |
| `/expenses/categories` | Category management | AppShell |
| `/notes` | Notes (folder sidebar + editor) | AppShell |
| `/notes/:id` | Specific note | AppShell |
| `/analytics` | Analytics dashboard | AppShell |
| `/reports` | Reports | AppShell |
| `/settings` | Settings (redirect to profile) | AppShell |
| `/settings/profile` | Profile & avatar | AppShell |
| `/settings/appearance` | Theme & display | AppShell |
| `/settings/preferences` | Timezone, currency, date | AppShell |
| `/settings/notifications` | Notification prefs | AppShell |
| `/settings/data` | Import / export / backup | AppShell |

---

## Sitemap tree

```
Nexora
│
├── 🔓 Public
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   ├── Reset Password
│   └── Verify Email
│
└── 🔒 App (authenticated)
    │
    ├── 📊 Dashboard
    │   ├── Today's Tasks
    │   ├── Upcoming Deadlines
    │   ├── Overdue Alert
    │   ├── Quick Add (Task / Expense)
    │   ├── Progress Charts
    │   ├── Habit Streaks
    │   ├── Goal Progress
    │   ├── Expense Summary
    │   ├── Calendar Widget
    │   └── Recent Activity
    │
    ├── ✅ Tasks
    │   ├── List View
    │   ├── Kanban View
    │   ├── Table View
    │   ├── Calendar View
    │   ├── Timeline View (V2)
    │   ├── Task Detail Panel
    │   │   ├── Properties
    │   │   ├── Checklist
    │   │   ├── Subtasks
    │   │   ├── Dependencies
    │   │   ├── Attachments
    │   │   └── Activity History
    │   ├── Filters & Search
    │   ├── Bulk Actions
    │   ├── Archive
    │   └── Trash
    │
    ├── 📅 Calendar
    │   ├── Month View
    │   ├── Week View
    │   ├── Day View
    │   ├── Agenda View
    │   └── Event Create/Edit Modal
    │
    ├── 🔄 Habits
    │   ├── Habit Grid/List
    │   ├── Habit Detail
    │   │   ├── Check-in
    │   │   ├── Streak Stats
    │   │   └── Heatmap
    │   └── Create/Edit Habit
    │
    ├── 🎯 Goals
    │   ├── Goals Board
    │   ├── Goal Detail
    │   │   ├── Milestones
    │   │   ├── Linked Tasks
    │   │   └── Progress Ring
    │   └── Create/Edit Goal
    │
    ├── 💰 Expenses
    │   ├── Overview (charts + summary)
    │   ├── Transactions
    │   │   ├── Income
    │   │   ├── Expense
    │   │   └── Transfer
    │   ├── Budgets
    │   ├── Categories
    │   └── Receipt Viewer
    │
    ├── 📝 Notes
    │   ├── Folder Sidebar
    │   ├── Note List
    │   ├── Rich Text Editor
    │   └── Search
    │
    ├── 📈 Analytics
    │   ├── Productivity Score
    │   ├── Task Metrics
    │   ├── Habit Metrics
    │   ├── Expense Trends
    │   └── Comparison Charts
    │
    ├── 📋 Reports
    │   ├── Weekly Report
    │   ├── Monthly Report
    │   └── Yearly Report
    │
    └── ⚙️ Settings
        ├── Profile (avatar, name, bio)
        ├── Appearance (theme)
        ├── Preferences (timezone, currency)
        ├── Notifications
        └── Data (import/export)
```

---

## App shell layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Header: Search (later) · Quick Add · Notifications · Avatar    │
├────────────┬─────────────────────────────────────────────────────┤
│            │                                                      │
│  Sidebar   │              Main Content Area                       │
│            │                                                      │
│  Logo      │   ┌─────────────────────────────────────────────┐   │
│  ───────   │   │  Page Header (title, actions, breadcrumbs)   │   │
│  Dashboard │   ├─────────────────────────────────────────────┤   │
│  Tasks     │   │                                              │   │
│  Calendar  │   │              Page Content                    │   │
│  Habits    │   │                                              │   │
│  Goals     │   │                                              │   │
│  Expenses  │   │                                              │   │
│  Notes     │   │                                              │   │
│  ───────   │   │                                              │   │
│  Analytics │   │                                              │   │
│  Reports   │   └─────────────────────────────────────────────┘   │
│  ───────   │                                                      │
│  Settings  │                                                      │
│            │                                                      │
│  [Theme]   │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

### Mobile layout (< 768px)

```
┌────────────────────────────┐
│  Header (hamburger + title)│
├────────────────────────────┤
│                            │
│      Main Content          │
│                            │
├────────────────────────────┤
│ 🏠  ✅  📅  📊  ☰         │
│ Dash Task Cal  More        │
└────────────────────────────┘
```

---

## Screen wireframe notes (key screens)

### Dashboard
- **Top:** Greeting ("Good morning, Irfan") + today's date
- **Row 1:** 4 stat cards (Tasks today, Overdue, Habits done, Spent today)
- **Row 2:** Today's tasks (left 60%) + Calendar widget (right 40%)
- **Row 3:** Weekly progress chart + Habit streaks
- **Row 4:** Goal progress + Recent activity
- **Floating:** Quick-add FAB on mobile

### Tasks — Kanban
- Horizontal columns with column headers + count badges
- Cards: emoji, title, priority dot, deadline, tags
- Top bar: view switcher, filters, search, + New Task

### Calendar — Month
- 7-column grid, today highlighted
- Task deadlines as dots, events as colored blocks
- Click day → day popover or navigate to day view

### Habits
- Grid of habit cards with large check-in button
- Streak flame icon + count
- Tap card → expand heatmap

### Expenses
- Top: Income / Expense / Balance summary cards
- Middle: Spending chart (donut by category)
- Bottom: Recent transactions list

### Notes
- Three-panel on desktop: folders | note list | editor
- Two-panel on tablet: list | editor
- Single panel on mobile with back navigation

### Settings
- Left sub-nav (desktop) or tabs (mobile)
- Profile: avatar upload dropzone, form fields
- Appearance: theme cards (light/dark/system preview)

---

## Component hierarchy (shared)

```
AppShell
├── Sidebar
│   ├── NavItem × 9
│   └── ThemeToggle
├── Header
│   ├── Breadcrumbs
│   ├── QuickAddButton
│   └── UserMenu
│       ├── Avatar
│       └── Dropdown (Profile, Settings, Logout)
└── Outlet (page content)
```

---

## URL & state conventions

| Pattern | Example |
|---------|---------|
| View in path | `/tasks/kanban` |
| Entity detail | `/tasks/:id` (slide-over panel, URL sync) |
| Filters in search params | `/tasks/list?status=todo&priority=high` |
| Settings tab | `/settings/appearance` |
| Modal deep link | `/tasks?new=true` |

---

## Accessibility targets

- Skip to main content link
- Sidebar keyboard navigable
- Focus trap in modals
- ARIA labels on icon buttons
- Color contrast WCAG AA
- Reduced motion respects `prefers-reduced-motion`
