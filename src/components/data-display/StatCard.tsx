import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: { value: number; label: string }
  className?: string
  accent?: 'default' | 'danger' | 'success' | 'warning'
}

const accentStyles = {
  default: 'from-indigo-500/10 to-violet-500/10',
  danger: 'from-red-500/10 to-orange-500/10',
  success: 'from-emerald-500/10 to-green-500/10',
  warning: 'from-amber-500/10 to-yellow-500/10',
}

export function StatCard({ title, value, subtitle, icon, trend, className, accent = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', accentStyles[accent])} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 shadow-sm">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
