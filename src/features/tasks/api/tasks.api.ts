import { supabase } from '@/lib/supabase/client'
import type { ActivityLogEntry, CreateTaskInput, Task } from '@/features/tasks/types/task.types'

const TASK_COLUMNS = '*'

export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_COLUMNS)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('is_archived', false)
    .order('is_pinned', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Task[]
}

export async function fetchArchivedTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_COLUMNS)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('is_archived', true)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Task[]
}

export async function fetchTrashedTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_COLUMNS)
    .eq('user_id', userId)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Task[]
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: input.title,
      priority: input.priority ?? 'medium',
      deadline: input.deadline ?? null,
      status: input.status ?? 'todo',
    })
    .select(TASK_COLUMNS)
    .single()

  if (error) throw error

  await logActivity(userId, 'task', data.id, 'created', { title: input.title })
  return data as Task
}

export async function updateTaskStatus(
  userId: string,
  taskId: string,
  status: Task['status']
): Promise<Task> {
  const updates: Record<string, unknown> = {
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select(TASK_COLUMNS)
    .single()

  if (error) throw error

  await logActivity(userId, 'task', taskId, status === 'completed' ? 'completed' : 'updated', { status })
  return data as Task
}

export async function updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select(TASK_COLUMNS)
    .single()

  if (error) throw error
  await logActivity(userId, 'task', taskId, 'updated', { fields: Object.keys(updates) })
  return data as Task
}

export async function archiveTask(userId: string, taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ is_archived: true })
    .eq('id', taskId)
    .eq('user_id', userId)
  if (error) throw error
  await logActivity(userId, 'task', taskId, 'archived', {})
}

export async function unarchiveTask(userId: string, taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ is_archived: false })
    .eq('id', taskId)
    .eq('user_id', userId)
  if (error) throw error
  await logActivity(userId, 'task', taskId, 'restored', { from: 'archive' })
}

export async function trashTask(userId: string, taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', userId)
  if (error) throw error
  await logActivity(userId, 'task', taskId, 'deleted', {})
}

export async function restoreTask(userId: string, taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: null, is_archived: false })
    .eq('id', taskId)
    .eq('user_id', userId)
  if (error) throw error
  await logActivity(userId, 'task', taskId, 'restored', { from: 'trash' })
}

export async function bulkUpdateTaskStatus(
  userId: string,
  taskIds: string[],
  status: Task['status']
): Promise<void> {
  if (taskIds.length === 0) return
  const updates: Record<string, unknown> = {
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
  }
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .in('id', taskIds)
    .eq('user_id', userId)
  if (error) throw error
}

export async function fetchActivityLog(userId: string, limit = 10): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as ActivityLogEntry[]
}

async function logActivity(
  userId: string,
  entityType: string,
  entityId: string,
  action: string,
  metadata: Record<string, unknown>
) {
  await supabase.from('activity_log').insert({
    user_id: userId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    metadata,
  })
}

export async function fetchTaskStats(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('status, completed_at, created_at')
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (error) throw error
  return data ?? []
}
