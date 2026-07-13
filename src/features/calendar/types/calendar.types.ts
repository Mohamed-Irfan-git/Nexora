export type CalendarEvent = {
  id: string
  user_id: string
  task_id: string | null
  title: string
  description: string | null
  location: string | null
  start_at: string
  end_at: string | null
  is_all_day: boolean
  color: string | null
  recurrence: string
  repeat_rule: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateEventInput = {
  title: string
  start_at: string
  end_at?: string | null
  is_all_day?: boolean
  color?: string | null
  description?: string | null
  location?: string | null
}

