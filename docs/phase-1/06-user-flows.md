# 06 — User Flows

Key journeys mapped as flow diagrams. Each flow assumes an authenticated user unless noted.

---

## 1. Onboarding & Authentication

### 1.1 New user registration (email)

```mermaid
flowchart TD
    A[Landing / Login page] --> B{Has account?}
    B -->|No| C[Click Sign Up]
    C --> D[Enter email + password + name]
    D --> E[Submit form]
    E --> F{Valid?}
    F -->|No| G[Show validation errors]
    G --> D
    F -->|Yes| H[Supabase creates auth.users]
    H --> I[Trigger: create profile + settings]
    I --> J[Send verification email]
    J --> K[Show: Check your email]
    K --> L[User clicks email link]
    L --> M[Email verified]
    M --> N[Redirect to Dashboard]
    N --> O[Optional: onboarding tour]
```

### 1.2 OAuth sign-in (Google / GitHub)

```mermaid
flowchart TD
    A[Login page] --> B[Click Google or GitHub]
    B --> C[Supabase OAuth redirect]
    C --> D{Authorized?}
    D -->|No| E[Return to login + error toast]
    D -->|Yes| F{First time?}
    F -->|Yes| G[Create profile via trigger]
    F -->|No| H[Load existing profile]
    G --> I[Redirect to Dashboard]
    H --> I
```

### 1.3 Forgot password

```mermaid
flowchart TD
    A[Login page] --> B[Click Forgot password]
    B --> C[Enter email]
    C --> D[Supabase sends reset link]
    D --> E[Show confirmation message]
    E --> F[User clicks email link]
    F --> G[Reset password form]
    G --> H[Submit new password]
    H --> I[Redirect to login]
```

---

## 2. Daily use — Morning check-in

```mermaid
flowchart TD
    A[Open Nexora] --> B[Auth check]
    B -->|Not logged in| C[Login]
    B -->|Logged in| D[Dashboard loads]
    D --> E[See: Today's tasks]
    D --> F[See: Overdue alerts]
    D --> G[See: Habit streaks]
    D --> H[See: Budget remaining]
    E --> I{Action?}
    I -->|Complete task| J[Toggle status → completed]
    J --> K[Optimistic UI + activity log]
    I -->|Quick add| L[Inline quick-add bar]
    L --> M[Task created → appears in list]
    G --> N{Check in habit?}
    N -->|Yes| O[One-tap check-in]
    O --> P[Streak updates]
```

---

## 3. Task management

### 3.1 Create task (full form)

```mermaid
flowchart TD
    A[Tasks page] --> B[Click + New Task]
    B --> C[Task form modal / panel]
    C --> D[Fill: title, priority, deadline, etc.]
    D --> E[Optional: add checklist, tags, subtasks]
    E --> F[Submit]
    F --> G{Zod valid?}
    G -->|No| H[Inline errors]
    G -->|Yes| I[Insert to Supabase]
    I --> J[Invalidate task queries]
    J --> K[Toast: Task created]
    K --> L[Task appears in current view]
```

### 3.2 Kanban workflow

```mermaid
flowchart TD
    A[Tasks → Kanban view] --> B[See columns: Todo, In Progress, Blocked, Done]
    B --> C[Drag card to new column]
    C --> D[dnd-kit onDragEnd]
    D --> E[Optimistic column update]
    E --> F[PATCH task.status]
    F --> G{Success?}
    G -->|Yes| H[Activity log: status changed]
    G -->|No| I[Rollback + error toast]
```

### 3.3 Recurring task

```mermaid
flowchart TD
    A[Create/Edit task] --> B[Enable recurrence]
    B --> C[Configure: daily/weekly/monthly/custom]
    C --> D[Save repeat_rule JSON]
    D --> E[Task stored once in DB]
    E --> F[Client expands instances for calendar/list]
    F --> G[On complete: optionally create next instance]
```

---

## 4. Calendar

```mermaid
flowchart TD
    A[Calendar page] --> B[Select view: Month / Week / Day / Agenda]
    B --> C[Load tasks with deadlines + calendar_events]
    C --> D[Render unified timeline]
    D --> E{User action}
    E -->|Click empty slot| F[New event form with pre-filled date]
    E -->|Click event| G[Event detail / edit panel]
    E -->|Drag event| H[Update start_at / end_at]
    F --> I[Save → refresh calendar]
    G --> I
    H --> I
```

---

## 5. Habit tracking

```mermaid
flowchart TD
    A[Habits page] --> B[View habit cards with streaks]
    B --> C{Action}
    C -->|Check in| D[Insert habit_completion]
    D --> E[Update streak display]
    E --> F[Dashboard widget refreshes]
    C -->|View heatmap| G[Load 90-day completions]
    G --> H[Render GitHub-style grid]
    C -->|Create habit| I[Habit form: name, frequency, target]
    I --> J[Save → new card appears]
```

---

## 6. Expense tracking

```mermaid
flowchart TD
    A[Expenses page] --> B[Click + Transaction]
    B --> C[Select type: Income / Expense / Transfer]
    C --> D[Enter amount, category, date, payment method]
    D --> E[Optional: upload receipt]
    E --> F[Save transaction]
    F --> G[Update budget progress]
    G --> H[Charts & dashboard refresh]
    H --> I{Over budget?}
    I -->|Yes| J[Show warning badge on category]
```

---

## 7. Goals & milestones

```mermaid
flowchart TD
    A[Goals page] --> B[Create goal with target date]
    B --> C[Add milestones]
    C --> D[Link tasks to goal]
    D --> E[Complete linked tasks]
    E --> F[Auto-recalculate goal progress %]
    F --> G{Progress = 100%?}
    G -->|Yes| H[Mark goal completed + celebration UI]
    G -->|No| I[Update progress ring]
```

---

## 8. Notes

```mermaid
flowchart TD
    A[Notes page] --> B[Sidebar: folders + note list]
    B --> C[Select or create note]
    C --> D[Tiptap editor loads]
    D --> E[User types / formats / inserts image]
    E --> F[Debounced auto-save]
    F --> G[Update notes.content + content_text]
    G --> H[Search index updated]
```

---

## 9. Analytics & Reports

```mermaid
flowchart TD
    A[Analytics page] --> B[Select date range]
    B --> C[Parallel queries: tasks, habits, expenses]
    C --> D[Compute: productivity score, trends]
    D --> E[Render Recharts dashboards]
    E --> F{Export?}
    F -->|Yes| G[Generate report view / PDF]
```

---

## 10. Settings & data management

```mermaid
flowchart TD
    A[Settings page] --> B{Section}
    B -->|Profile| C[Edit name, avatar, timezone, currency]
    B -->|Appearance| D[Toggle light / dark / system]
    B -->|Notifications| E[Toggle email/push prefs]
    B -->|Data| F{Action}
    F -->|Export| G[Fetch all user data → JSON download]
    F -->|Import| H[Upload JSON → validate → insert]
    C --> I[Save → update profiles table]
    D --> I
```

---

## 11. Error & edge case flows

### Session expired
```
API 401 → Clear session → Redirect to /login → Toast "Session expired"
```

### Network offline
```
Mutation fails → Toast "Offline" → Keep optimistic state → Retry on reconnect
```

### RLS violation
```
Supabase error → Toast "Permission denied" → Log to console (dev)
```

### Soft-deleted item
```
Trash view → Restore (clear deleted_at) OR Permanent delete
Archive view → Unarchive (clear is_archived)
```

---

## 12. Navigation flow (authenticated app)

```mermaid
flowchart LR
    subgraph Sidebar
        D[Dashboard]
        T[Tasks]
        C[Calendar]
        H[Habits]
        G[Goals]
        E[Expenses]
        N[Notes]
        A[Analytics]
        R[Reports]
        S[Settings]
    end

    D --- T
    T --- C
    C --- H
    H --- G
    G --- E
    E --- N
    N --- A
    A --- R
    R --- S

    T --> T1[List]
    T --> T2[Kanban]
    T --> T3[Table]
    T --> T4[Calendar]
```

Mobile: Sidebar collapses to bottom tab bar (Dashboard, Tasks, Calendar, More).
