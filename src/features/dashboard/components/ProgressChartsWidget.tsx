import { useMemo } from 'react'
import { format, subDays, startOfDay } from 'date-fns'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/charts/ChartContainer'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { ProgressRing } from '@/components/data-display/ProgressRing'

type TaskStat = { status: string; completed_at: string | null; created_at: string }

export function ProgressChartsWidget({
  stats,
  weekProgress,
  monthProgress,
  loading,
}: {
  stats: TaskStat[] | undefined
  weekProgress: number
  monthProgress: number
  loading?: boolean
}) {
  const chartData = useMemo(() => {
    if (!stats) return []
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i))
      const key = format(date, 'yyyy-MM-dd')
      const completed = stats.filter(
        (t) => t.completed_at && t.completed_at.startsWith(key)
      ).length
      return { day: format(date, 'EEE'), completed }
    })
    return days
  }, [stats])

  if (loading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    )
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Weekly Progress</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ProgressRing progress={weekProgress} size={36} strokeWidth={3} />
            <div>
              <p className="text-xs text-muted-foreground">This week</p>
              <p className="text-sm font-semibold">{weekProgress}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing progress={monthProgress} size={36} strokeWidth={3} />
            <div>
              <p className="text-xs text-muted-foreground">This month</p>
              <p className="text-sm font-semibold">{monthProgress}%</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="day" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
