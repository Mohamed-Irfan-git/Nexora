import { RotateCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useRestoreTask, useTrashedTasks } from '@/features/tasks/hooks/useTasks'
import { BadgePriority } from '@/components/data-display/BadgePriority'

export function TrashedTasksPage() {
  const { data: tasks = [], isLoading } = useTrashedTasks()
  const restore = useRestoreTask()

  return (
    <>
      <PageHeader title="Trash" description="Soft-deleted tasks can be restored anytime." />
      <Card>
        <CardHeader>
          <CardTitle>Deleted tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : tasks.length === 0 ? (
            <EmptyState title="Trash is empty" description="Deleted tasks appear here." />
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <div className="mt-1">
                    <BadgePriority priority={task.priority} />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => restore.mutate(task.id)}>
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  )
}
