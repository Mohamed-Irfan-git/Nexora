import { cn } from '@/lib/utils/cn'
import type { TaskPriority, TaskStatus } from '@/features/tasks/types/task.types'

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

export function BadgePriority({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn('inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize', priorityStyles[priority])}>
      {priority}
    </span>
  )
}

export function BadgeStatus({ status }: { status: TaskStatus }) {
  const label = status.replace('_', ' ')
  return (
    <span className={cn('inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize', statusStyles[status])}>
      {label}
    </span>
  )
}
