export type TransactionType = 'income' | 'expense' | 'transfer'

export type Transaction = {
  id: string
  user_id: string
  category_id: string | null
  payment_method_id: string | null
  type: TransactionType
  amount: number
  currency: string
  description: string | null
  notes: string | null
  transaction_date: string
  is_recurring: boolean
  repeat_rule: Record<string, unknown> | null
  transfer_to_account_id: string | null
  receipt_path: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Budget = {
  id: string
  user_id: string
  category_id: string | null
  name: string
  amount: number
  period: 'weekly' | 'monthly' | 'yearly'
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type ExpenseCategory = {
  id: string
  user_id: string
  name: string
  icon: string | null
  color: string | null
  type: string
  is_default: boolean
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type PaymentMethod = {
  id: string
  user_id: string
  name: string
  type: string
  is_default: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}
