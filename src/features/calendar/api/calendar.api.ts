import { supabase } from '@/lib/supabase/client'
import type { CalendarEvent, CreateEventInput } from '@/features/calendar/types/calendar.types'

const COLS = '*'

export async function fetchEvents(userId: string, start: string, end: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select(COLS)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('start_at', start)
    .lte('start_at', end)
    .order('start_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as CalendarEvent[]
}

export async function createEvent(userId: string, input: CreateEventInput): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      user_id: userId,
      title: input.title,
      start_at: input.start_at,
      end_at: input.end_at ?? null,
      is_all_day: input.is_all_day ?? false,
      color: input.color ?? null,
      description: input.description ?? null,
      location: input.location ?? null,
      recurrence: 'none',
    })
    .select(COLS)
    .single()

  if (error) throw error
  return data as CalendarEvent
}

export async function updateEvent(userId: string, eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', eventId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function deleteEvent(userId: string, eventId: string): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', eventId)
    .eq('user_id', userId)

  if (error) throw error
}

