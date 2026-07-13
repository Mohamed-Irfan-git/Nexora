import { format } from 'date-fns'
import { AlertTriangle, CheckSquare, Clock, Wallet } from 'lucide-react'
import { StatCard } from '@/components/data-display/StatCard'
import { DashboardSkeleton } from '@/components/feedback/LoadingSkeleton'
import { PageHeader } from '@/components/layout/PageHeader'
import { CalendarWidget } from '@/features/dashboard/components/CalendarWidget'
import { OverdueTasksWidget, UpcomingDeadlinesWidget } from '@/features/dashboard/components/DeadlineWidgets'
import { ExpenseSummaryWidget } from '@/features/dashboard/components/ExpenseSummaryWidget'
import { GoalProgressWidget } from '@/features/dashboard/components/GoalProgressWidget'
import { HabitStreaksWidget } from '@/features/dashboard/components/HabitStreaksWidget'
import { ProgressChartsWidget } from '@/features/dashboard/components/ProgressChartsWidget'
import { QuickAddBar } from '@/features/dashboard/components/QuickAddBar'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { TodaysTasksWidget } from '@/features/dashboard/components/TodaysTasksWidget'
import {
  useExpenseSummary,
  useGoalProgress,
  useHabitStreaks,
} from '@/features/dashboard/hooks/useDashboard'
import {
  useActivityLog,
  useTaskFilters,
  useTaskStats,
  useTasks,
} from '@/features/tasks/hooks/useTasks'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { getGreeting, formatCurrency } from '@/lib/utils/date'

export function DashboardPage() {
  const { profile } = useAuthContext()
  const { data: tasks, isLoading: tasksLoading } = useTasks()
  const { data: stats, isLoading: statsLoading } = useTaskStats()
  const { data: activities, isLoading: activityLoading } = useActivityLog()
  const { data: habits, isLoading: habitsLoading } = useHabitStreaks()
  const { data: expenses, isLoading: expensesLoading } = useExpenseSummary()
  const { data: goals, isLoading: goalsLoading } = useGoalProgress()

  const filters = useTaskFilters(tasks)
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const currency = profile?.currency ?? 'USD'

  if (tasksLoading && !tasks) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <PageHeader
        title={`${getGreeting()}, ${firstName}`}
        description={format(new Date(), 'EEEE, MMMM d, yyyy')}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasks today"
          value={filters.today.length}
          icon={<CheckSquare className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Overdue"
          value={filters.overdue.length}
          accent={filters.overdue.length > 0 ? 'danger' : 'default'}
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        />
        <StatCard
          title="Completed this week"
          value={filters.completedThisWeek}
          subtitle={`${filters.weekProgress}% completion rate`}
          accent="success"
          icon={<Clock className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          title="Spent today"
          value={formatCurrency(expenses?.todayTotal ?? 0, currency)}
          subtitle={expenses?.budgetRemaining != null ? 'Budget tracked' : 'No budget set'}
          icon={<Wallet className="h-5 w-5 text-violet-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <TodaysTasksWidget tasks={filters.today} loading={tasksLoading} />
            <OverdueTasksWidget tasks={filters.overdue} loading={tasksLoading} />
          </div>
          <ProgressChartsWidget
            stats={stats}
            weekProgress={filters.weekProgress}
            monthProgress={filters.monthProgress}
            loading={statsLoading}
          />
          <UpcomingDeadlinesWidget tasks={filters.upcoming} loading={tasksLoading} />
        </div>

        <div className="space-y-6">
          <CalendarWidget tasks={tasks ?? []} loading={tasksLoading} />
          <ExpenseSummaryWidget summary={expenses} loading={expensesLoading} />
          <HabitStreaksWidget habits={habits} loading={habitsLoading} />
          <GoalProgressWidget goals={goals} loading={goalsLoading} />
          <RecentActivityFeed activities={activities} loading={activityLoading} />
        </div>
      </div>

      <QuickAddBar />
    </>
  )
}
