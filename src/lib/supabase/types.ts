export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<Profile, Partial<Profile> & { id: string }>
      user_settings: TableDef<Record<string, unknown>>
      tasks: TableDef<TaskRow, Partial<TaskRow> & { user_id: string; title: string }>
      calendar_events: TableDef<Record<string, unknown>>
      activity_log: TableDef<
        ActivityLogRow,
        Partial<ActivityLogRow> & { user_id: string; entity_type: string; entity_id: string; action: string }
      >
      milestones: TableDef<Record<string, unknown>>
      habits: TableDef<Record<string, unknown>>
      habit_completions: TableDef<Record<string, unknown>>
      transactions: TableDef<Record<string, unknown>>
      budgets: TableDef<Record<string, unknown>>
      payment_methods: TableDef<Record<string, unknown>>
      goals: TableDef<Record<string, unknown>>
      categories: TableDef<Record<string, unknown>>
      tags: TableDef<Record<string, unknown>>
      notes: TableDef<Record<string, unknown>>
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  timezone: string
  locale: string
  currency: string
  date_format: string
  theme: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type TaskRow = {
  id: string
  user_id: string
  title: string
  status: string
  priority: string
  deadline: string | null
  start_date: string | null
  completed_at: string | null
  created_at: string
  [key: string]: unknown
}

export type ActivityLogRow = {
  id: string
  user_id: string
  entity_type: string
  entity_id: string
  action: string
  metadata: Record<string, unknown> | null
  created_at: string
}
