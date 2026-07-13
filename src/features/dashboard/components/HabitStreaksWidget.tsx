import { Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import type { HabitWithStreak } from '@/features/habits/api/habits.api'

export function HabitStreaksWidget({ habits, loading }: { habits: HabitWithStreak[] | undefined; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Habit Streaks</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !habits?.length ? (
          <EmptyState
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            title="No habits yet"
            description="Create habits in Phase 5 to track streaks here."
          />
        ) : (
          <div className="space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{habit.icon ?? '✨'}</span>
                  <span className="text-sm font-medium">{habit.name}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-orange-500">
                  <Flame className="h-4 w-4" />
                  {habit.streak}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
