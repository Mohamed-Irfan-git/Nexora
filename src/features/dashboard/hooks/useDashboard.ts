import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { fetchHabitStreaks } from '@/features/habits/api/habits.api'
import { fetchExpenseSummary } from '@/features/expenses/api/expenses.api'
import { fetchGoalProgress } from '@/features/goals/api/goals.api'

export const dashboardKeys = {
  habits: ['dashboard', 'habits'] as const,
  expenses: ['dashboard', 'expenses'] as const,
  goals: ['dashboard', 'goals'] as const,
}

export function useHabitStreaks() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: dashboardKeys.habits,
    queryFn: () => fetchHabitStreaks(user!.id),
    enabled: !!user,
  })
}

export function useExpenseSummary() {
  const { user, profile } = useAuthContext()
  return useQuery({
    queryKey: dashboardKeys.expenses,
    queryFn: () => fetchExpenseSummary(user!.id, profile?.currency ?? 'USD'),
    enabled: !!user,
  })
}

export function useGoalProgress() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: dashboardKeys.goals,
    queryFn: () => fetchGoalProgress(user!.id),
    enabled: !!user,
  })
}
