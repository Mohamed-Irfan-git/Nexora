import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addMonths, endOfMonth, startOfMonth } from 'date-fns'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { createEvent, deleteEvent, fetchEvents, updateEvent } from '@/features/calendar/api/calendar.api'
import type { CalendarEvent, CreateEventInput } from '@/features/calendar/types/calendar.types'

export const calendarKeys = {
  month: (monthIso: string) => ['calendar', 'month', monthIso] as const,
}

export function useMonthEvents(month: Date) {
  const { user } = useAuthContext()
  const start = startOfMonth(month).toISOString()
  const end = endOfMonth(addMonths(month, 0)).toISOString()

  return useQuery({
    queryKey: calendarKeys.month(start),
    queryFn: () => fetchEvents(user!.id, start, end),
    enabled: !!user,
  })
}

export function useCreateEvent() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(user!.id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar'] }),
  })
}

export function useUpdateEvent() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, updates }: { eventId: string; updates: Partial<CalendarEvent> }) =>
      updateEvent(user!.id, eventId, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar'] }),
  })
}

export function useDeleteEvent() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(user!.id, eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar'] }),
  })
}

