# 04 — Database Schema

PostgreSQL schema for Supabase. All tables use UUID primary keys, `user_id` FK to `auth.users`, `created_at` / `updated_at` timestamps, and Row Level Security.

---

## Conventions

| Rule | Implementation |
|------|----------------|
| Primary key | `id UUID DEFAULT gen_random_uuid()` |
| User scope | `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE` |
| Timestamps | `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()` |
| Soft delete | `deleted_at TIMESTAMPTZ` where noted |
| Updated trigger | `BEFORE UPDATE` → set `updated_at = now()` |
| RLS | `ENABLE ROW LEVEL SECURITY` + policy per operation |

---

## Enums

```sql
-- Task
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'blocked', 'completed', 'cancelled');
CREATE TYPE task_timeframe AS ENUM ('daily', 'weekly', 'monthly', 'yearly', 'one_time');

-- Calendar
CREATE TYPE event_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly', 'yearly', 'custom');

-- Habits
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE habit_period AS ENUM ('day', 'week', 'month');

-- Goals
CREATE TYPE goal_type AS ENUM ('short_term', 'long_term');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'paused', 'cancelled');

-- Expenses
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE budget_period AS ENUM ('weekly', 'monthly', 'yearly');

-- Notes
CREATE TYPE note_format AS ENUM ('rich', 'markdown');

-- Activity
CREATE TYPE activity_action AS ENUM (
  'created', 'updated', 'deleted', 'completed', 'archived',
  'restored', 'checked_in', 'linked', 'unlinked'
);
CREATE TYPE activity_entity AS ENUM (
  'task', 'subtask', 'calendar_event', 'habit', 'goal',
  'milestone', 'expense', 'budget', 'note', 'profile'
);
```

---

## 1. Profiles & Settings

### `profiles`
Extends `auth.users` with app-specific data.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | = `auth.users.id` |
| email | TEXT | Denormalized for display |
| full_name | TEXT | |
| avatar_url | TEXT | Storage path |
| bio | TEXT | |
| timezone | TEXT | Default `UTC` |
| locale | TEXT | Default `en` |
| currency | TEXT | Default `USD` |
| date_format | TEXT | Default `MMM d, yyyy` |
| theme | TEXT | `light`, `dark`, `system` |
| onboarding_completed | BOOLEAN | Default false |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Indexes:** `profiles_email_idx` on `email`

### `user_settings`
Notification & preference key-value store.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | UNIQUE |
| email_notifications | BOOLEAN | |
| push_notifications | BOOLEAN | |
| task_reminders | BOOLEAN | |
| habit_reminders | BOOLEAN | |
| budget_alerts | BOOLEAN | |
| weekly_report | BOOLEAN | |
| settings_json | JSONB | Extensible prefs |
| created_at, updated_at | | |

---

## 2. Tags & Categories (shared)

### `tags`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| name | TEXT | |
| color | TEXT | Hex |
| created_at, updated_at | | |

**Unique:** `(user_id, name)`

### `categories`
Used by tasks and expenses.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| name | TEXT | |
| icon | TEXT | Emoji or icon name |
| color | TEXT | |
| type | TEXT | `task`, `expense`, `both` |
| is_default | BOOLEAN | System-seeded |
| sort_order | INT | |
| created_at, updated_at, deleted_at | | |

---

## 3. Tasks

### `tasks`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| parent_id | UUID FK → tasks | Subtask parent |
| goal_id | UUID FK → goals | Nullable |
| category_id | UUID FK | |
| title | TEXT NOT NULL | |
| description | TEXT | |
| notes | TEXT | |
| status | task_status | Default `todo` |
| priority | task_priority | Default `medium` |
| timeframe | task_timeframe | Default `one_time` |
| estimated_minutes | INT | |
| actual_minutes | INT | |
| start_date | DATE | |
| deadline | TIMESTAMPTZ | |
| reminder_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |
| repeat_rule | JSONB | RFC 5545-like RRULE |
| location | TEXT | |
| color | TEXT | |
| emoji | TEXT | |
| is_favorite | BOOLEAN | |
| is_pinned | BOOLEAN | |
| is_archived | BOOLEAN | |
| sort_order | INT | Kanban/list order |
| created_at, updated_at, deleted_at | | |

**Indexes:**
- `(user_id, status)` WHERE `deleted_at IS NULL`
- `(user_id, deadline)` WHERE `deleted_at IS NULL`
- `(user_id, is_pinned, sort_order)`
- `(parent_id)` WHERE `parent_id IS NOT NULL`
- `(goal_id)` WHERE `goal_id IS NOT NULL`

### `task_tags` (junction)
| task_id | UUID FK |
| tag_id | UUID FK |
| PRIMARY KEY (task_id, tag_id) |

### `task_checklist_items`
| Column | Type |
|--------|------|
| id | UUID PK |
| task_id | UUID FK |
| user_id | UUID FK |
| title | TEXT |
| is_completed | BOOLEAN |
| sort_order | INT |
| created_at, updated_at | |

### `task_dependencies`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| task_id | UUID FK | Dependent task |
| depends_on_task_id | UUID FK | Must complete first |
| created_at | | |

**Unique:** `(task_id, depends_on_task_id)`

### `task_attachments`
| Column | Type |
|--------|------|
| id | UUID PK |
| task_id | UUID FK |
| user_id | UUID FK |
| file_name | TEXT |
| file_path | TEXT | Storage path |
| file_size | INT |
| mime_type | TEXT |
| created_at | |

---

## 4. Calendar

### `calendar_events`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| task_id | UUID FK | Optional link |
| title | TEXT NOT NULL | |
| description | TEXT | |
| location | TEXT | |
| start_at | TIMESTAMPTZ NOT NULL | |
| end_at | TIMESTAMPTZ | |
| is_all_day | BOOLEAN | |
| color | TEXT | |
| recurrence | event_recurrence | |
| repeat_rule | JSONB | Custom recurrence |
| created_at, updated_at, deleted_at | | |

**Indexes:**
- `(user_id, start_at)` WHERE `deleted_at IS NULL`
- `(task_id)` WHERE `task_id IS NOT NULL`

---

## 5. Habits

### `habits`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| goal_id | UUID FK | Optional |
| name | TEXT NOT NULL | |
| description | TEXT | |
| icon | TEXT | Emoji |
| color | TEXT | |
| frequency | habit_frequency | |
| target_count | INT | e.g. 3x per week |
| period | habit_period | |
| reminder_time | TIME | |
| is_archived | BOOLEAN | |
| sort_order | INT | |
| created_at, updated_at, deleted_at | | |

### `habit_completions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| habit_id | UUID FK | |
| user_id | UUID FK | |
| completed_at | TIMESTAMPTZ | |
| note | TEXT | |
| created_at | | |

**Unique:** `(habit_id, completed_at::date)` for daily dedup  
**Index:** `(user_id, habit_id, completed_at)`

---

## 6. Goals

### `goals`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| title | TEXT NOT NULL | |
| description | TEXT | |
| type | goal_type | |
| status | goal_status | |
| target_date | DATE | |
| progress | INT | 0–100 |
| color | TEXT | |
| icon | TEXT | |
| is_archived | BOOLEAN | |
| completed_at | TIMESTAMPTZ | |
| created_at, updated_at, deleted_at | | |

### `milestones`
| Column | Type |
|--------|------|
| id | UUID PK |
| goal_id | UUID FK |
| user_id | UUID FK |
| title | TEXT |
| is_completed | BOOLEAN |
| completed_at | TIMESTAMPTZ |
| sort_order | INT |
| created_at, updated_at | |

---

## 7. Expenses

### `payment_methods`
| Column | Type |
|--------|------|
| id | UUID PK |
| user_id | UUID FK |
| name | TEXT | Cash, Visa, etc. |
| type | TEXT | cash, card, bank, digital |
| is_default | BOOLEAN |
| created_at, updated_at, deleted_at | |

### `budgets`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| category_id | UUID FK | |
| name | TEXT | |
| amount | DECIMAL(12,2) | |
| period | budget_period | |
| start_date | DATE | |
| end_date | DATE | |
| created_at, updated_at, deleted_at | | |

### `transactions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| category_id | UUID FK | |
| payment_method_id | UUID FK | |
| type | transaction_type | |
| amount | DECIMAL(12,2) | Always positive |
| currency | TEXT | Default from profile |
| description | TEXT | |
| notes | TEXT | |
| transaction_date | DATE | |
| is_recurring | BOOLEAN | |
| repeat_rule | JSONB | |
| transfer_to_account_id | UUID | For transfers |
| receipt_path | TEXT | Storage |
| created_at, updated_at, deleted_at | | |

**Indexes:**
- `(user_id, transaction_date)` WHERE `deleted_at IS NULL`
- `(user_id, type, transaction_date)`
- `(category_id)`

### `transaction_tags` (junction)
| transaction_id | UUID FK |
| tag_id | UUID FK |

---

## 8. Notes

### `note_folders`
| Column | Type |
|--------|------|
| id | UUID PK |
| user_id | UUID FK |
| parent_id | UUID FK → note_folders |
| name | TEXT |
| sort_order | INT |
| created_at, updated_at, deleted_at | |

### `notes`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| folder_id | UUID FK | |
| title | TEXT | |
| content | JSONB | Tiptap document |
| content_text | TEXT | Plain text for search |
| format | note_format | |
| is_pinned | BOOLEAN | |
| created_at, updated_at, deleted_at | | |

**Index:** GIN on `to_tsvector('english', content_text)` for full-text search

### `note_tags` (junction)
| note_id | UUID FK |
| tag_id | UUID FK |

### `note_links` (polymorphic)
| Column | Type |
|--------|------|
| id | UUID PK |
| note_id | UUID FK |
| user_id | UUID FK |
| entity_type | TEXT | task, goal |
| entity_id | UUID |
| created_at | |

---

## 9. Activity Log

### `activity_log`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| entity_type | activity_entity | |
| entity_id | UUID | |
| action | activity_action | |
| metadata | JSONB | Changed fields snapshot |
| created_at | TIMESTAMPTZ | |

**Index:** `(user_id, created_at DESC)`

Populated via Postgres triggers on INSERT/UPDATE/DELETE of main tables.

---

## 10. Storage Buckets

| Bucket | Path pattern | Max size |
|--------|--------------|----------|
| `avatars` | `{user_id}/avatar.{ext}` | 2 MB |
| `attachments` | `{user_id}/tasks/{task_id}/{file}` | 10 MB |
| `receipts` | `{user_id}/receipts/{id}.{ext}` | 5 MB |
| `note-images` | `{user_id}/notes/{note_id}/{file}` | 5 MB |

RLS: Users can only access objects where folder prefix matches `auth.uid()`.

---

## 11. RLS Policy Pattern

Every table follows this template:

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (user_id = auth.uid());
```

Junction tables inherit access via EXISTS subquery on parent.

---

## 12. Triggers

### `handle_updated_at()`
Generic trigger function for all tables with `updated_at`.

### `handle_new_user()`
On `auth.users` INSERT → create `profiles` + `user_settings` + default categories.

### `log_activity()`
Generic trigger for activity_log inserts on domain tables.

---

## 13. Database views (analytics)

### `v_task_stats_daily`
Aggregates completed tasks per day per user.

### `v_expense_monthly`
Sum expenses/income by month, category.

### `v_habit_streaks`
Computed current/longest streak per habit.

These can be regular views or materialized views refreshed on schedule (V2).

---

## Table count summary

| Domain | Tables |
|--------|--------|
| Auth/Profile | 2 |
| Shared | 2 |
| Tasks | 5 |
| Calendar | 1 |
| Habits | 2 |
| Goals | 2 |
| Expenses | 4 |
| Notes | 4 |
| Activity | 1 |
| **Total** | **23 tables** |
