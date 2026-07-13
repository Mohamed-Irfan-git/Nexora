import { supabase } from '@/lib/supabase/client'
import type { CreateHabitInput, Habit, HabitCompletion } from '@/features/habits/types/habit.types'

export type HabitWithStreak = {
  id: string
  name: string
  icon: string | null
  color: string | null
  streak: number
}

export async function fetchHabitStreaks(userId: string): Promise<HabitWithStreak[]> {
  const { data: habits, error } = await supabase
    .from('habits')
    .select('id, name, icon, color')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('is_archived', false)
    .order('sort_order')
    .limit(5)

  if (error) throw error
  if (!habits?.length) return []

  const habitIds = habits.map((h) => h.id)
  const { data: completions } = await supabase
    .from('habit_completions')
    .select('habit_id, completed_at')
    .eq('user_id', userId)
    .in('habit_id', habitIds)
    .order('completed_at', { ascending: false })

  return habits.map((habit) => ({
    id: habit.id as string,
    name: habit.name as string,
    icon: (habit.icon as string | null) ?? null,
    color: (habit.color as string | null) ?? null,
    streak: calculateStreak(
      completions?.filter((c) => c.habit_id === habit.id) as { completed_at: string }[] ?? []
    ),
  }))
}

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('is_archived', false)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Habit[]
}

export async function createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      name: input.name,
      icon: input.icon ?? '✨',
      color: input.color ?? null,
      frequency: input.frequency ?? 'daily',
      target_count: input.target_count ?? 1,
      period: input.period ?? 'day',
    })
    .select('*')
    .single()

  if (error) throw error
  return data as Habit
}

export async function archiveHabit(userId: string, habitId: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ is_archived: true })
    .eq('id', habitId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function unarchiveHabit(userId: string, habitId: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ is_archived: false })
    .eq('id', habitId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function addHabitCompletion(userId: string, habitId: string): Promise<HabitCompletion> {
  const { data, error } = await supabase
    .from('habit_completions')
    .insert({ user_id: userId, habit_id: habitId, completed_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw error
  return data as HabitCompletion
}

export async function fetchHabitCompletions(userId: string, habitId: string, startIso: string): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .gte('completed_at', startIso)
    .order('completed_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as HabitCompletion[]
}

function calculateStreak(completions: { completed_at: string }[]): number {
  if (!completions.length) return 0
  const days = new Set(completions.map((c) => c.completed_at.slice(0, 10)))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (days.has(key)) streak++
    else if (i > 0) break
  }
  return streak
}
