import { format, parseISO, isSameDay } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import type { Task } from '@/features/tasks/types/task.types'
import { cn } from '@/lib/utils/cn'

export function CalendarWidget({ tasks, loading }: { tasks: Task[]; loading?: boolean }) {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - today.getDay() + i)
    return d
  })

  const tasksWithDeadline = tasks.filter((t) => t.deadline && t.status !== 'completed')

  const getTasksForDay = (day: Date) =>
    tasksWithDeadline.filter((t) => t.deadline && isSameDay(parseISO(t.deadline), day))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CalendarIcon className="h-4 w-4" />
          This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayTasks = getTasksForDay(day)
              const isToday = isSameDay(day, today)
              return (
                <div key={day.toISOString()} className="flex flex-col items-center">
                  <span className="mb-1 text-[10px] font-medium text-muted-foreground uppercase">
                    {format(day, 'EEE')}
                  </span>
                  <div
                    className={cn(
                      'flex h-9 w-9 flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors',
                      isToday ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="mt-1 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t) => (
                        <div key={t.id} className="h-1 w-1 rounded-full bg-primary" />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        {!loading && tasksWithDeadline.length === 0 && (
          <EmptyState
            title="No deadlines this week"
            description="Add deadlines to tasks to see them here."
            className="py-6"
          />
        )}
      </CardContent>
    </Card>
  )
}
