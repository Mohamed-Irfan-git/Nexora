import { Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { ProgressRing } from '@/components/data-display/ProgressRing'
import type { GoalProgress } from '@/features/goals/api/goals.api'

export function GoalProgressWidget({ goals, loading }: { goals: GoalProgress[] | undefined; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !goals?.length ? (
          <EmptyState
            icon={<Target className="h-5 w-5 text-primary" />}
            title="No active goals"
            description="Set goals in Phase 6 to track progress here."
          />
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/50">
                <ProgressRing progress={goal.progress} size={40} strokeWidth={3} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {goal.icon && <span className="mr-1">{goal.icon}</span>}
                    {goal.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{goal.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
