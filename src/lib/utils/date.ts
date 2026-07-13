import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  format,
  isBefore,
  isToday,
  parseISO,
} from 'date-fns'

export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function todayRange() {
  const now = new Date()
  return { start: startOfDay(now).toISOString(), end: endOfDay(now).toISOString() }
}

export function weekRange() {
  const now = new Date()
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
    end: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
  }
}

export function monthRange() {
  const now = new Date()
  return {
    start: startOfMonth(now).toISOString(),
    end: endOfMonth(now).toISOString(),
  }
}

export function upcomingRange(days = 7) {
  const now = new Date()
  return {
    start: startOfDay(now).toISOString(),
    end: endOfDay(addDays(now, days)).toISOString(),
  }
}

export function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false
  return isBefore(parseISO(deadline), startOfDay(new Date()))
}

export function isDueToday(deadline: string | null): boolean {
  if (!deadline) return false
  return isToday(parseISO(deadline))
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return ''
  const date = parseISO(deadline)
  if (isToday(date)) return 'Today'
  return format(date, 'MMM d')
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}
