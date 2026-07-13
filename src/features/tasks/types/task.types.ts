export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'

export type Task = {
  id: string
  user_id: string
  parent_id: string | null
  goal_id: string | null
  category_id: string | null
  title: string
  description: string | null
  notes: string | null
  status: TaskStatus
  priority: TaskPriority
  timeframe: string
  estimated_minutes: number | null
  actual_minutes: number | null
  start_date: string | null
  deadline: string | null
  reminder_at: string | null
  completed_at: string | null
  repeat_rule: Record<string, unknown> | null
  location: string | null
  color: string | null
  emoji: string | null
  is_favorite: boolean
  is_pinned: boolean
  is_archived: boolean
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateTaskInput = {
  title: string
  priority?: TaskPriority
  deadline?: string | null
  status?: TaskStatus
}

export type ActivityLogEntry = {
  id: string
  user_id: string
  entity_type: string
  entity_id: string
  action: string
  metadata: Record<string, unknown> | null
  created_at: string
}
