export type Goal = {
  id: string
  user_id: string
  title: string
  description: string | null
  type: 'short_term' | 'long_term'
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  target_date: string | null
  progress: number
  color: string | null
  icon: string | null
  is_archived: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Milestone = {
  id: string
  goal_id: string
  user_id: string
  title: string
  is_completed: boolean
  completed_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type CreateGoalInput = {
  title: string
  type?: Goal['type']
  target_date?: string | null
  icon?: string | null
  color?: string | null
  description?: string | null
}
