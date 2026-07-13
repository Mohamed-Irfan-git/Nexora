import { supabase } from '@/lib/supabase/client'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export type ExpenseSummary = {
  todayTotal: number
  monthTotal: number
  monthIncome: number
  budgetRemaining: number | null
}

export async function fetchExpenseSummary(userId: string, currency = 'USD'): Promise<ExpenseSummary> {
  const now = new Date()
  const todayStart = startOfDay(now).toISOString().slice(0, 10)
  const todayEnd = endOfDay(now).toISOString().slice(0, 10)
  const monthStart = startOfMonth(now).toISOString().slice(0, 10)
  const monthEnd = endOfMonth(now).toISOString().slice(0, 10)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('type, amount, transaction_date')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('transaction_date', monthStart)
    .lte('transaction_date', monthEnd)

  const txs = (transactions ?? []) as { type: string; amount: number; transaction_date: string }[]
  const todayTotal = txs
    .filter((t) => t.type === 'expense' && t.transaction_date >= todayStart && t.transaction_date <= todayEnd)
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthTotal = txs
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthIncome = txs
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const { data: budgets } = await supabase
    .from('budgets')
    .select('amount')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .eq('period', 'monthly')

  const totalBudget = (budgets ?? []).reduce((sum, b) => sum + Number((b as { amount: number }).amount), 0)
  const budgetRemaining = totalBudget > 0 ? totalBudget - monthTotal : null

  void currency
  return { todayTotal, monthTotal, monthIncome, budgetRemaining }
}
