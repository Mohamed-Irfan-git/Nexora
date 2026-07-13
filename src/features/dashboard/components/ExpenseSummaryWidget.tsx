import { Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import type { ExpenseSummary } from '@/features/expenses/api/expenses.api'
import { formatCurrency } from '@/lib/utils/date'
import { useAuthContext } from '@/features/auth/context/AuthContext'

export function ExpenseSummaryWidget({ summary, loading }: { summary: ExpenseSummary | undefined; loading?: boolean }) {
  const { profile } = useAuthContext()
  const currency = profile?.currency ?? 'USD'

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Wallet className="h-4 w-4" />
          Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="font-semibold">{formatCurrency(summary?.todayTotal ?? 0, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This month</span>
              <span className="font-semibold">{formatCurrency(summary?.monthTotal ?? 0, currency)}</span>
            </div>
            {summary?.budgetRemaining != null && (
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                <span className="text-sm text-muted-foreground">Budget left</span>
                <span className={`font-semibold ${summary.budgetRemaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {formatCurrency(summary.budgetRemaining, currency)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
