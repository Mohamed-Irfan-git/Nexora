import { ArchiveRestore } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useArchivedTasks, useUnarchiveTask } from '@/features/tasks/hooks/useTasks'
import { BadgePriority } from '@/components/data-display/BadgePriority'

export function ArchivedTasksPage() {
  const { data: tasks = [], isLoading } = useArchivedTasks()
  const unarchive = useUnarchiveTask()

  return (
    <>
      <PageHeader title="Archived Tasks" description="Tasks moved out of active views." />
      <Card>
        <CardHeader>
          <CardTitle>Archive</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : tasks.length === 0 ? (
            <EmptyState title="No archived tasks" description="Archive tasks from Tasks view to see them here." />
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <div className="mt-1">
                    <BadgePriority priority={task.priority} />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => unarchive.mutate(task.id)}>
                  <ArchiveRestore className="h-4 w-4" />
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
