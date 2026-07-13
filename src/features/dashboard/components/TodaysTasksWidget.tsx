import { Check, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BadgePriority } from '@/components/data-display/BadgePriority'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import type { Task } from '@/features/tasks/types/task.types'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/useTasks'
import { formatDeadline } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'

function TaskRow({ task }: { task: Task }) {
  const updateStatus = useUpdateTaskStatus()
  const isCompleted = task.status === 'completed'

  const toggle = () => {
    updateStatus.mutate({
      taskId: task.id,
      status: isCompleted ? 'todo' : 'completed',
    })
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50">
      <button
        type="button"
        onClick={toggle}
        disabled={updateStatus.isPending}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 hover:border-primary'
        )}
      >
        {isCompleted && <Check className="h-3 w-3" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-medium', isCompleted && 'text-muted-foreground line-through')}>
          {task.emoji && <span className="mr-1">{task.emoji}</span>}
          {task.title}
        </p>
        {task.deadline && (
          <p className="text-xs text-muted-foreground">{formatDeadline(task.deadline)}</p>
        )}
      </div>
      <BadgePriority priority={task.priority} />
    </div>
  )
}

export function TodaysTasksWidget({ tasks, loading }: { tasks: Task[]; loading?: boolean }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Today&apos;s Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<Circle className="h-5 w-5 text-muted-foreground" />}
            title="No tasks for today"
            description="You're all caught up! Add a task to get started."
          />
        ) : (
          <div className="space-y-0.5">
            {tasks.slice(0, 6).map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
