import { supabase } from '@/lib/supabase/client'
import type { CreateGoalInput, Goal, Milestone } from '@/features/goals/types/goal.types'

export type GoalProgress = {
  id: string
  title: string
  progress: number
  icon: string | null
  color: string | null
  target_date: string | null
}

export async function fetchGoalProgress(userId: string): Promise<GoalProgress[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('id, title, progress, icon, color, target_date')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('status', 'active')
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })
    .limit(4)

  if (error) throw error
  return (data ?? []) as GoalProgress[]
}

export async function fetchGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Goal[]
}

export async function createGoal(userId: string, input: CreateGoalInput): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      title: input.title,
      type: input.type ?? 'short_term',
      target_date: input.target_date ?? null,
      icon: input.icon ?? '🎯',
      color: input.color ?? null,
      description: input.description ?? null,
      status: 'active',
      progress: 0,
    })
    .select('*')
    .single()

  if (error) throw error
  return data as Goal
}

export async function updateGoal(userId: string, goalId: string, updates: Partial<Goal>): Promise<void> {
  const { error } = await supabase.from('goals').update(updates).eq('id', goalId).eq('user_id', userId)
  if (error) throw error
}
export async function deleteGoal(userId: string, goalId: string) {
  const { data, error } = await supabase
    .from("goals")
    .update({
      deleted_at: new Date().toISOString(),
      is_archived: true,
    })
    .eq("id", goalId)
    .eq("user_id", userId)
    .select();

  console.log("Data:", data);
  console.log("Error:", error);

  if (error) throw error;
}

export async function fetchMilestones(userId: string, goalId: string): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as Milestone[]
}

export async function createMilestone(userId: string, goalId: string, title: string): Promise<Milestone> {
  const { data, error } = await supabase
    .from('milestones')
    .insert({ user_id: userId, goal_id: goalId, title, is_completed: false })
    .select('*')
    .single()
  if (error) throw error
  return data as Milestone
}

export async function toggleMilestone(userId: string, milestone: Milestone): Promise<void> {
  const next = !milestone.is_completed
  const { error } = await supabase
    .from('milestones')
    .update({ is_completed: next, completed_at: next ? new Date().toISOString() : null })
    .eq('id', milestone.id)
    .eq('user_id', userId)
  if (error) throw error
}
