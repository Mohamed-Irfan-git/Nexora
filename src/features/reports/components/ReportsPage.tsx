import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useTransactions } from '@/features/expenses/hooks/useExpenses'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { formatCurrency } from '@/lib/utils/date'

function summarizeTasks(tasks: Array<{ status: string; completed_at: string | null; created_at: string }>, start: string, end: string) {
  const created = tasks.filter((t) => t.created_at >= start && t.created_at <= end).length
  const completed = tasks.filter((t) => t.completed_at && t.completed_at >= start && t.completed_at <= end).length
  return { created, completed, rate: created > 0 ? Math.round((completed / created) * 100) : 0 }
}

function summarizeMoney(txs: Array<{ type: string; amount: number; transaction_date: string }>, start: string, end: string) {
  const scoped = txs.filter((t) => t.transaction_date >= start.slice(0, 10) && t.transaction_date <= end.slice(0, 10))
  const income = scoped.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const expense = scoped.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
  return { income, expense, balance: income - expense }
}

export function ReportsPage() {
  const { profile } = useAuthContext()
  const currency = profile?.currency ?? 'USD'
  const { data: tasks = [] } = useTasks()
  const { data: transactions = [] } = useTransactions()

  const now = new Date()
  const weekly = summarizeTasks(tasks, startOfWeek(now, { weekStartsOn: 1 }).toISOString(), endOfWeek(now, { weekStartsOn: 1 }).toISOString())
  const monthly = summarizeTasks(tasks, startOfMonth(now).toISOString(), endOfMonth(now).toISOString())
  const yearly = summarizeTasks(tasks, startOfYear(now).toISOString(), endOfYear(now).toISOString())

  const weeklyMoney = summarizeMoney(transactions, startOfWeek(now, { weekStartsOn: 1 }).toISOString(), endOfWeek(now, { weekStartsOn: 1 }).toISOString())
  const monthlyMoney = summarizeMoney(transactions, startOfMonth(now).toISOString(), endOfMonth(now).toISOString())
  const yearlyMoney = summarizeMoney(transactions, startOfYear(now).toISOString(), endOfYear(now).toISOString())

  return (
    <>
      <PageHeader title="Reports" description="Weekly, monthly, and yearly summaries from live data." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Weekly report</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border p-3">Created tasks: <strong>{weekly.created}</strong></div>
            <div className="rounded-xl border p-3">Completed tasks: <strong>{weekly.completed}</strong></div>
            <div className="rounded-xl border p-3">Completion rate: <strong>{weekly.rate}%</strong></div>
            <div className="rounded-xl border p-3">Net cash flow: <strong>{formatCurrency(weeklyMoney.balance, currency)}</strong></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Monthly report</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border p-3">Created tasks: <strong>{monthly.created}</strong></div>
            <div className="rounded-xl border p-3">Completed tasks: <strong>{monthly.completed}</strong></div>
            <div className="rounded-xl border p-3">Completion rate: <strong>{monthly.rate}%</strong></div>
            <div className="rounded-xl border p-3">Income: <strong>{formatCurrency(monthlyMoney.income, currency)}</strong></div>
            <div className="rounded-xl border p-3">Expense: <strong>{formatCurrency(monthlyMoney.expense, currency)}</strong></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Yearly report</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border p-3">Created tasks: <strong>{yearly.created}</strong></div>
            <div className="rounded-xl border p-3">Completed tasks: <strong>{yearly.completed}</strong></div>
            <div className="rounded-xl border p-3">Completion rate: <strong>{yearly.rate}%</strong></div>
            <div className="rounded-xl border p-3">Income: <strong>{formatCurrency(yearlyMoney.income, currency)}</strong></div>
            <div className="rounded-xl border p-3">Expense: <strong>{formatCurrency(yearlyMoney.expense, currency)}</strong></div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
