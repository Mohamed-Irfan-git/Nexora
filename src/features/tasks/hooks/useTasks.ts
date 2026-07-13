import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  fetchTasks,
  fetchArchivedTasks,
  fetchTrashedTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  archiveTask,
  unarchiveTask,
  trashTask,
  restoreTask,
  bulkUpdateTaskStatus,
  fetchActivityLog,
  fetchTaskStats,
} from '@/features/tasks/api/tasks.api'
import type { CreateTaskInput, Task } from '@/features/tasks/types/task.types'
import { isDueToday, isOverdue, weekRange, monthRange, upcomingRange } from '@/lib/utils/date'

export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
  archived: () => [...taskKeys.all, 'archived'] as const,
  trash: () => [...taskKeys.all, 'trash'] as const,
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

export function useArchivedTasks() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: taskKeys.archived(),
    queryFn: () => fetchArchivedTasks(user!.id),
    enabled: !!user,
  })
}

export function useTrashedTasks() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: taskKeys.trash(),
    queryFn: () => fetchTrashedTasks(user!.id),
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

export function useUpdateTask() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(user!.id, taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: taskKeys.activity() })
    },
  })
}

function useInvalidateTaskLists() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.all })
    queryClient.invalidateQueries({ queryKey: taskKeys.activity() })
  }
}

export function useArchiveTask() {
  const { user } = useAuthContext()
  const invalidate = useInvalidateTaskLists()
  return useMutation({
    mutationFn: (taskId: string) => archiveTask(user!.id, taskId),
    onSuccess: invalidate,
  })
}

export function useUnarchiveTask() {
  const { user } = useAuthContext()
  const invalidate = useInvalidateTaskLists()
  return useMutation({
    mutationFn: (taskId: string) => unarchiveTask(user!.id, taskId),
    onSuccess: invalidate,
  })
}

export function useTrashTask() {
  const { user } = useAuthContext()
  const invalidate = useInvalidateTaskLists()
  return useMutation({
    mutationFn: (taskId: string) => trashTask(user!.id, taskId),
    onSuccess: invalidate,
  })
}

export function useRestoreTask() {
  const { user } = useAuthContext()
  const invalidate = useInvalidateTaskLists()
  return useMutation({
    mutationFn: (taskId: string) => restoreTask(user!.id, taskId),
    onSuccess: invalidate,
  })
}

export function useBulkUpdateTaskStatus() {
  const { user } = useAuthContext()
  const invalidate = useInvalidateTaskLists()
  return useMutation({
    mutationFn: ({ taskIds, status }: { taskIds: string[]; status: Task['status'] }) =>
      bulkUpdateTaskStatus(user!.id, taskIds, status),
    onSuccess: invalidate,
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
