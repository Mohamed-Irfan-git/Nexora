export type Habit = {
  id: string
  user_id: string
  goal_id: string | null
  name: string
  description: string | null
  icon: string | null
  color: string | null
  frequency: 'daily' | 'weekly' | 'monthly'
  target_count: number
  period: 'day' | 'week' | 'month'
  reminder_time: string | null
  is_archived: boolean
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type HabitCompletion = {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  note: string | null
  created_at: string
}

export type CreateHabitInput = {
  name: string
  icon?: string | null
  color?: string | null
  frequency?: Habit['frequency']
  target_count?: number
  period?: Habit['period']
}

