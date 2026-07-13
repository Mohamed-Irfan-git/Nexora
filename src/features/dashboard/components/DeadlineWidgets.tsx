import { AlertTriangle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BadgePriority } from '@/components/data-display/BadgePriority'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import type { Task } from '@/features/tasks/types/task.types'
import { formatDeadline } from '@/lib/utils/date'

export function OverdueTasksWidget({ tasks, loading }: { tasks: Task[]; loading?: boolean }) {
  return (
    <Card className={tasks.length > 0 ? 'border-red-200 dark:border-red-900/50' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          {tasks.length > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
          Overdue
          {tasks.length > 0 && (
            <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {tasks.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-5 w-5 text-emerald-500" />}
            title="No overdue tasks"
            description="Great job staying on top of things!"
          />
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 dark:bg-red-950/20">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">{formatDeadline(task.deadline)}</p>
                </div>
                <BadgePriority priority={task.priority} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function UpcomingDeadlinesWidget({ tasks, loading }: { tasks: Task[]; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Upcoming Deadlines</CardTitle>
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
            icon={<Clock className="h-5 w-5 text-muted-foreground" />}
            title="No upcoming deadlines"
            description="Tasks with deadlines this week appear here."
          />
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-muted/50">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDeadline(task.deadline)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
