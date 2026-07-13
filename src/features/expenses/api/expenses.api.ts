import { supabase } from '@/lib/supabase/client'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'
import type { Budget, ExpenseCategory, PaymentMethod, Transaction, TransactionType } from '@/features/expenses/types/expense.types'

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

export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Transaction[]
}

export async function createTransaction(
  userId: string,
  input: {
    type: TransactionType
    amount: number
    description?: string
    transaction_date: string
    category_id?: string | null
    payment_method_id?: string | null
    currency: string
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: input.type,
      amount: input.amount,
      description: input.description ?? null,
      transaction_date: input.transaction_date,
      category_id: input.category_id ?? null,
      payment_method_id: input.payment_method_id ?? null,
      currency: input.currency,
      is_recurring: false,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Transaction
}

export async function fetchBudgets(userId: string): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Budget[]
}

export async function createBudget(
  userId: string,
  input: { name: string; amount: number; period: Budget['period']; category_id?: string | null }
): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: userId,
      name: input.name,
      amount: input.amount,
      period: input.period,
      category_id: input.category_id ?? null,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Budget
}

export async function fetchExpenseCategories(userId: string): Promise<ExpenseCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .in('type', ['expense', 'both'])
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as ExpenseCategory[]
}

export async function createExpenseCategory(
  userId: string,
  input: { name: string; icon?: string | null; color?: string | null }
): Promise<ExpenseCategory> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: input.name,
      icon: input.icon ?? '💸',
      color: input.color ?? null,
      type: 'expense',
      is_default: false,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as ExpenseCategory
}

export async function fetchPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as PaymentMethod[]
}

export async function createPaymentMethod(
  userId: string,
  input: { name: string; type: string }
): Promise<PaymentMethod> {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      is_default: false,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as PaymentMethod
}
