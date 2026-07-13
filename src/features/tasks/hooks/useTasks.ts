import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
  fetchActivityLog,
  fetchTaskStats,
} from '@/features/tasks/api/tasks.api'
import type { CreateTaskInput, Task } from '@/features/tasks/types/task.types'
import { isDueToday, isOverdue, weekRange, monthRange, upcomingRange } from '@/lib/utils/date'

export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
  activity: () => ['activity'] as const,
}

export function useTasks() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: () => fetchTasks(user!.id),
    enabled: !!user,
  })
}

export function useTaskStats() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => fetchTaskStats(user!.id),
    enabled: !!user,
  })
}

export function useActivityLog() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: taskKeys.activity(),
    queryFn: () => fetchActivityLog(user!.id),
    enabled: !!user,
  })
}

export function useCreateTask() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: taskKeys.activity() })
    },
  })
}

export function useUpdateTaskStatus() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Task['status'] }) =>
      updateTaskStatus(user!.id, taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.list() })
      const previous = queryClient.getQueryData<Task[]>(taskKeys.list())
      queryClient.setQueryData<Task[]>(taskKeys.list(), (old) =>
        old?.map((t) =>
          t.id === taskId
            ? { ...t, status, completed_at: status === 'completed' ? new Date().toISOString() : null }
            : t
        ) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(taskKeys.list(), context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: taskKeys.activity() })
    },
  })
}

export function useTaskFilters(tasks: Task[] | undefined) {
  const active = tasks?.filter((t) => t.status !== 'completed' && t.status !== 'cancelled') ?? []
  const overdue = active.filter((t) => isOverdue(t.deadline))
  const today = active.filter((t) => {
    if (isDueToday(t.deadline)) return true
    if (t.start_date && isDueToday(t.start_date)) return true
    if (!t.deadline) return true
    return false
  })
  const upcoming = active
    .filter((t) => {
      if (!t.deadline) return false
      const { start, end } = upcomingRange(7)
      return t.deadline >= start && t.deadline <= end && !isOverdue(t.deadline)
    })
    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
    .slice(0, 5)

  const completed = tasks?.filter((t) => t.status === 'completed') ?? []

  const week = weekRange()
  const month = monthRange()

  const completedThisWeek = completed.filter(
    (t) => t.completed_at && t.completed_at >= week.start && t.completed_at <= week.end
  ).length

  const completedThisMonth = completed.filter(
    (t) => t.completed_at && t.completed_at >= month.start && t.completed_at <= month.end
  ).length

  const totalThisWeek = (tasks ?? []).filter(
    (t) => t.created_at >= week.start && t.created_at <= week.end
  ).length

  const totalThisMonth = (tasks ?? []).filter(
    (t) => t.created_at >= month.start && t.created_at <= month.end
  ).length

  return {
    active,
    overdue,
    today,
    upcoming,
    completed,
    completedThisWeek,
    completedThisMonth,
    totalThisWeek,
    totalThisMonth,
    weekProgress: totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0,
    monthProgress: totalThisMonth > 0 ? Math.round((completedThisMonth / totalThisMonth) * 100) : 0,
  }
}
