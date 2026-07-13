import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  addHabitCompletion,
  createHabit,
  fetchHabitCompletions,
  fetchHabits,
} from '@/features/habits/api/habits.api'
import type { CreateHabitInput } from '@/features/habits/types/habit.types'

export const habitKeys = {
  all: ['habits'] as const,
  list: () => [...habitKeys.all, 'list'] as const,
  completions: (habitId: string) => [...habitKeys.all, 'completions', habitId] as const,
}

export function useHabits() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: habitKeys.list(),
    queryFn: () => fetchHabits(user!.id),
    enabled: !!user,
  })
}

export function useCreateHabit() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateHabitInput) => createHabit(user!.id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: habitKeys.all }),
  })
}

export function useHabitCompletions(habitId: string | null) {
  const { user } = useAuthContext()
  const start = subDays(new Date(), 90).toISOString()
  return useQuery({
    queryKey: habitId ? habitKeys.completions(habitId) : ['habits', 'completions', 'none'],
    queryFn: () => fetchHabitCompletions(user!.id, habitId!, start),
    enabled: !!user && !!habitId,
  })
}

export function useHabitCheckIn() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (habitId: string) => addHabitCompletion(user!.id, habitId),
    onSuccess: (_data, habitId) => {
      qc.invalidateQueries({ queryKey: habitKeys.all })
      qc.invalidateQueries({ queryKey: habitKeys.completions(habitId) })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

