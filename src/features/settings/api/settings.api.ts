import { supabase } from '@/lib/supabase/client'

export type UserSettings = {
  id: string
  user_id: string
  email_notifications: boolean
  push_notifications: boolean
  task_reminders: boolean
  habit_reminders: boolean
  budget_alerts: boolean
  weekly_report: boolean
  settings_json: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function fetchUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).single()
  if (error) return null
  return data as UserSettings
}

export async function updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', userId)
    .select('*')
    .single()
  if (error) throw error
  return data as UserSettings
}

export async function exportUserData(userId: string) {
  const tables = [
    'profiles',
    'user_settings',
    'tasks',
    'calendar_events',
    'habits',
    'habit_completions',
    'goals',
    'milestones',
    'transactions',
    'budgets',
    'categories',
    'payment_methods',
    'notes',
    'note_folders',
    'activity_log',
  ] as const

  const result: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    version: 1,
    user_id: userId,
  }

  for (const table of tables) {
    const column = table === 'profiles' ? 'id' : 'user_id'
    const { data, error } = await (supabase.from(table as never) as any).select('*').eq(column, userId)
    if (error) throw error
    result[table] = data ?? []
  }

  return result
}

type ImportPayload = Record<string, unknown[]>

async function clearUserTable(table: string, userId: string) {
  const column = table === 'profiles' ? 'id' : 'user_id'
  const { error } = await (supabase.from(table as never) as any).delete().eq(column, userId)
  if (error) throw error
}

export async function importUserData(userId: string, payload: ImportPayload) {
  const orderedTables = [
    'categories',
    'payment_methods',
    'goals',
    'milestones',
    'tasks',
    'calendar_events',
    'habits',
    'habit_completions',
    'budgets',
    'transactions',
    'note_folders',
    'notes',
  ]

  for (const table of orderedTables) {
    if (Array.isArray(payload[table])) {
      await clearUserTable(table, userId)
      const rows = payload[table].map((row) => ({ ...(row as Record<string, unknown>), user_id: userId }))
      if (rows.length > 0) {
        const { error } = await (supabase.from(table as never) as any).insert(rows)
        if (error) throw error
      }
    }
  }
}
