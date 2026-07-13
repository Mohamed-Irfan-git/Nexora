import type { ReactNode } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils/cn'

export function ChartContainer({ children, className }: { children: ReactNode; className?: string }) {
  const { resolvedTheme } = useTheme()
  const tickColor = resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'
  const gridColor = resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'

  return (
    <div
      className={cn('w-full', className)}
      style={
        {
          '--chart-tick': tickColor,
          '--chart-grid': gridColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
