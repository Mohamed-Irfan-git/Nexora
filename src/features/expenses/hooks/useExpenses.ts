import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  createBudget,
  createExpenseCategory,
  createPaymentMethod,
  createTransaction,
  fetchBudgets,
  fetchExpenseCategories,
  fetchPaymentMethods,
  fetchTransactions,
} from '@/features/expenses/api/expenses.api'
import type { Budget, TransactionType } from '@/features/expenses/types/expense.types'

export const expenseKeys = {
  all: ['expenses'] as const,
  transactions: () => [...expenseKeys.all, 'transactions'] as const,
  budgets: () => [...expenseKeys.all, 'budgets'] as const,
  categories: () => [...expenseKeys.all, 'categories'] as const,
  methods: () => [...expenseKeys.all, 'methods'] as const,
}

export function useTransactions() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: expenseKeys.transactions(),
    queryFn: () => fetchTransactions(user!.id),
    enabled: !!user,
  })
}

export function useBudgets() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: expenseKeys.budgets(),
    queryFn: () => fetchBudgets(user!.id),
    enabled: !!user,
  })
}

export function useExpenseCategories() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: expenseKeys.categories(),
    queryFn: () => fetchExpenseCategories(user!.id),
    enabled: !!user,
  })
}

export function usePaymentMethods() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: expenseKeys.methods(),
    queryFn: () => fetchPaymentMethods(user!.id),
    enabled: !!user,
  })
}

export function useCreateTransaction() {
  const { user, profile } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      type: TransactionType
      amount: number
      description?: string
      transaction_date: string
      category_id?: string | null
      payment_method_id?: string | null
    }) =>
      createTransaction(user!.id, {
        ...input,
        currency: profile?.currency ?? 'USD',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCreateBudget() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; amount: number; period: Budget['period']; category_id?: string | null }) =>
      createBudget(user!.id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCreateExpenseCategory() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; icon?: string | null; color?: string | null }) =>
      createExpenseCategory(user!.id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.categories() }),
  })
}

export function useCreatePaymentMethod() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; type: string }) => createPaymentMethod(user!.id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.methods() }),
  })
}
