import { supabase } from '@/lib/supabase/client'

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
