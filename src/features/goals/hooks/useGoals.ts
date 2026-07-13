import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  createGoal,
  createMilestone,
  fetchGoals,
  fetchMilestones,
  toggleMilestone,
  updateGoal,
  deleteGoal,
} from '@/features/goals/api/goals.api'
import type { CreateGoalInput, Goal, Milestone } from '@/features/goals/types/goal.types'

export const goalKeys = {
  all: ['goals'] as const,
  list: () => [...goalKeys.all, 'list'] as const,
  milestones: (goalId: string) => [...goalKeys.all, 'milestones', goalId] as const,
}

export function useGoals() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: goalKeys.list(),
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  })
}

export function useMilestones(goalId: string | null) {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: goalId ? goalKeys.milestones(goalId) : ['goals', 'milestones', 'none'],
    queryFn: () => fetchMilestones(user!.id, goalId!),
    enabled: !!user && !!goalId,
  })
}

export function useCreateGoal() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGoalInput) => createGoal(user!.id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateGoal() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ goalId, updates }: { goalId: string; updates: Partial<Goal> }) =>
      updateGoal(user!.id, goalId, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCreateMilestone(goalId: string | null) {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (title: string) => createMilestone(user!.id, goalId!, title),
    onSuccess: () => {
      if (goalId) qc.invalidateQueries({ queryKey: goalKeys.milestones(goalId) })
    },
  })
}

export function useToggleMilestone(goalId: string | null) {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (milestone: Milestone) => toggleMilestone(user!.id, milestone),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      if (goalId) qc.invalidateQueries({ queryKey: goalKeys.milestones(goalId) })
    },
  })
}

export function useDeleteGoal() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (goalId: string) => deleteGoal(user!.id, goalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
