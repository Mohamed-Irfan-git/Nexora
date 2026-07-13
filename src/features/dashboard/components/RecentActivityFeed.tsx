import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import type { ActivityLogEntry } from '@/features/tasks/types/task.types'

const actionLabels: Record<string, string> = {
  created: 'created',
  updated: 'updated',
  completed: 'completed',
  deleted: 'deleted',
  archived: 'archived',
  checked_in: 'checked in',
}

export function RecentActivityFeed({ activities, loading }: { activities: ActivityLogEntry[] | undefined; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !activities?.length ? (
          <EmptyState
            title="No activity yet"
            description="Your actions will appear here as you use Nexora."
          />
        ) : (
          <div className="space-y-3">
            {activities.map((entry) => {
              const meta = entry.metadata as { title?: string; status?: string } | null
              const label = actionLabels[entry.action] ?? entry.action
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="capitalize">{entry.entity_type}</span>{' '}
                      <span className="text-muted-foreground">{label}</span>
                      {meta?.title && (
                        <span className="font-medium"> — {meta.title}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
