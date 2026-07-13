import { useMemo } from 'react'
import { subMonths, format, startOfMonth } from 'date-fns'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatCard } from '@/components/data-display/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChartContainer } from '@/components/charts/ChartContainer'
import { useTaskStats, useTasks } from '@/features/tasks/hooks/useTasks'
import { useHabitStreaks } from '@/features/dashboard/hooks/useDashboard'
import { useTransactions } from '@/features/expenses/hooks/useExpenses'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { formatCurrency } from '@/lib/utils/date'

export function AnalyticsPage() {
  const { profile } = useAuthContext()
  const currency = profile?.currency ?? 'USD'
  const { data: tasks = [] } = useTasks()
  const { data: stats = [] } = useTaskStats()
  const { data: habits = [] } = useHabitStreaks()
  const { data: transactions = [] } = useTransactions()

  const taskCompletion = tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100) : 0
  const avgTasksPerDay = stats.length > 0 ? Number((stats.length / 30).toFixed(1)) : 0
  const focusTime = tasks.reduce((sum, t) => sum + Number(t.actual_minutes ?? 0), 0)
  const habitConsistency = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0

  const monthlyTx = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = startOfMonth(subMonths(new Date(), 5 - i))
      const key = format(month, 'yyyy-MM')
      const label = format(month, 'MMM')
      const income = transactions
        .filter((t) => t.type === 'income' && t.transaction_date.startsWith(key))
        .reduce((sum, t) => sum + Number(t.amount), 0)
      const expense = transactions
        .filter((t) => t.type === 'expense' && t.transaction_date.startsWith(key))
        .reduce((sum, t) => sum + Number(t.amount), 0)
      return { month: label, income, expense }
    })
  }, [transactions])

  const weeklyCompletion = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const key = format(date, 'yyyy-MM-dd')
      const completed = stats.filter((s) => s.completed_at?.startsWith(key)).length
      return { day: format(date, 'EEE'), completed }
    })
  }, [stats])

  const productivityScore = Math.min(100, Math.round(taskCompletion * 0.5 + Math.min(habitConsistency, 100) * 0.3 + Math.min(focusTime / 12, 100) * 0.2))

  return (
    <>
      <PageHeader title="Analytics" description="Productivity, habit, and financial trends in one place." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Productivity score" value={`${productivityScore}%`} />
        <StatCard title="Task completion" value={`${taskCompletion}%`} />
        <StatCard title="Average tasks/day" value={avgTasksPerDay} />
        <StatCard title="Focus time" value={`${focusTime} min`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Weekly task completion</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyCompletion}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Income vs expense trend</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTx}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0), currency)} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b98133" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef444433" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Habit consistency</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {habits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No habits tracked yet.</p>
            ) : (
              habits.map((habit) => (
                <div key={habit.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{habit.icon ?? '✨'} {habit.name}</span>
                    <span className="text-sm text-orange-500">{habit.streak} day streak</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Financial snapshot</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border p-3">
              <p className="text-sm text-muted-foreground">6-month income</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(monthlyTx.reduce((sum, m) => sum + m.income, 0), currency)}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-sm text-muted-foreground">6-month expense</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(monthlyTx.reduce((sum, m) => sum + m.expense, 0), currency)}</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-sm text-muted-foreground">Monthly comparison</p>
              <p className="mt-1 text-lg font-semibold">
                {monthlyTx.length >= 2 ? `${formatCurrency(monthlyTx.at(-1)?.expense ?? 0, currency)} vs ${formatCurrency(monthlyTx.at(-2)?.expense ?? 0, currency)}` : 'Not enough data'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
