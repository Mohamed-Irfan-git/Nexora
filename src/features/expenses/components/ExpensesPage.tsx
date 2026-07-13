import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CreditCard, Plus, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatCard } from '@/components/data-display/StatCard'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  useBudgets,
  useCreateBudget,
  useCreateExpenseCategory,
  useCreatePaymentMethod,
  useCreateTransaction,
  useExpenseCategories,
  usePaymentMethods,
  useTransactions,
} from '@/features/expenses/hooks/useExpenses'
import { formatCurrency } from '@/lib/utils/date'
import type { TransactionType } from '@/features/expenses/types/expense.types'

export function ExpensesPage() {
  const { profile } = useAuthContext()
  const currency = profile?.currency ?? 'USD'
  const { data: transactions = [], isLoading } = useTransactions()
  const { data: budgets = [] } = useBudgets()
  const { data: categories = [] } = useExpenseCategories()
  const { data: methods = [] } = usePaymentMethods()
  const createTransaction = useCreateTransaction()
  const createBudget = useCreateBudget()
  const createCategory = useCreateExpenseCategory()
  const createMethod = useCreatePaymentMethod()

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [categoryId, setCategoryId] = useState<string>('')
  const [paymentMethodId, setPaymentMethodId] = useState<string>('')
  const [budgetName, setBudgetName] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [methodName, setMethodName] = useState('')

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    const budgetTotal = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
    return { income, expense, balance: income - expense, budgetTotal, budgetLeft: budgetTotal - expense }
  }, [transactions, budgets])

  return (
    <>
      <PageHeader title="Expenses" description="Track transactions, budgets, and payment methods." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Income" value={formatCurrency(summary.income, currency)} icon={<Wallet className="h-5 w-5 text-emerald-500" />} accent="success" />
        <StatCard title="Expenses" value={formatCurrency(summary.expense, currency)} icon={<CreditCard className="h-5 w-5 text-red-500" />} accent="danger" />
        <StatCard title="Balance" value={formatCurrency(summary.balance, currency)} icon={<Wallet className="h-5 w-5 text-primary" />} />
        <StatCard title="Budget left" value={formatCurrency(summary.budgetLeft, currency)} subtitle={`${budgets.length} budgets`} accent={summary.budgetLeft < 0 ? 'danger' : 'success'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="h-10 rounded-xl border bg-background px-3 text-sm">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" min="0" step="0.01" />
              </div>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
              <div className="grid gap-3 md:grid-cols-3">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="h-10 rounded-xl border bg-background px-3 text-sm">
                  <option value="">Category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.icon ?? '💸'} {c.name}</option>)}
                </select>
                <select value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} className="h-10 rounded-xl border bg-background px-3 text-sm">
                  <option value="">Payment method</option>
                  {methods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <Input type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} id="tx-date" />
              </div>
              <Button
                onClick={async () => {
                  if (!amount) return
                  const dateValue = (document.getElementById('tx-date') as HTMLInputElement | null)?.value || format(new Date(), 'yyyy-MM-dd')
                  await createTransaction.mutateAsync({
                    type,
                    amount: Number(amount),
                    description,
                    transaction_date: dateValue,
                    category_id: categoryId || null,
                    payment_method_id: paymentMethodId || null,
                  })
                  setAmount('')
                  setDescription('')
                  setCategoryId('')
                  setPaymentMethodId('')
                }}
                disabled={!amount || createTransaction.isPending}
              >
                <Plus className="h-4 w-4" />
                Save transaction
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <EmptyState title="No transactions yet" description="Add your first income or expense above." />
              ) : (
                transactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="font-medium">{tx.description || 'Untitled transaction'}</p>
                      <p className="text-xs text-muted-foreground">{tx.type} · {tx.transaction_date}</p>
                    </div>
                    <span className={tx.type === 'expense' ? 'font-semibold text-red-500' : 'font-semibold text-emerald-600'}>
                      {tx.type === 'expense' ? '-' : '+'}{formatCurrency(Number(tx.amount), tx.currency || currency)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Budgets</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={budgetName} onChange={(e) => setBudgetName(e.target.value)} placeholder="Budget name" />
                <Input value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="Amount" type="number" min="0" step="0.01" />
              </div>
              <Button
                onClick={async () => {
                  if (!budgetName.trim() || !budgetAmount) return
                  await createBudget.mutateAsync({ name: budgetName.trim(), amount: Number(budgetAmount), period: 'monthly' })
                  setBudgetName('')
                  setBudgetAmount('')
                }}
                disabled={!budgetName.trim() || !budgetAmount}
              >
                Add budget
              </Button>
              <div className="space-y-2">
                {budgets.map((b) => (
                  <div key={b.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{b.name}</span>
                      <span className="text-sm">{formatCurrency(Number(b.amount), currency)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{b.period}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category" />
                <Button
                  onClick={async () => {
                    if (!categoryName.trim()) return
                    await createCategory.mutateAsync({ name: categoryName.trim(), icon: '💸' })
                    setCategoryName('')
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="rounded-xl border p-3 text-sm">
                    {c.icon ?? '💸'} {c.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment methods</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={methodName} onChange={(e) => setMethodName(e.target.value)} placeholder="Method name" />
                <Button
                  onClick={async () => {
                    if (!methodName.trim()) return
                    await createMethod.mutateAsync({ name: methodName.trim(), type: 'card' })
                    setMethodName('')
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {methods.map((m) => (
                  <div key={m.id} className="rounded-xl border p-3 text-sm">
                    {m.name} <span className="text-muted-foreground">· {m.type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
