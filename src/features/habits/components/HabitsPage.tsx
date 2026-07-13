import { useMemo, useState } from 'react'
import { addDays, format, startOfDay, subDays } from 'date-fns'
import { Flame, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { cn } from '@/lib/utils/cn'
import { useCreateHabit, useHabitCheckIn, useHabitCompletions, useHabits } from '@/features/habits/hooks/useHabits'
import type { Habit } from '@/features/habits/types/habit.types'

function computeStreak(completions: { completed_at: string }[]) {
  const set = new Set(completions.map((c) => c.completed_at.slice(0, 10)))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (set.has(key)) streak++
    else if (i > 0) break
  }
  return streak
}

function Heatmap({ completions }: { completions: { completed_at: string }[] }) {
  const start = startOfDay(subDays(new Date(), 89))
  const days = Array.from({ length: 90 }, (_, i) => addDays(start, i))
  const set = new Set(completions.map((c) => c.completed_at.slice(0, 10)))

  return (
    <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
      {days.map((d) => {
        const key = format(d, 'yyyy-MM-dd')
        const done = set.has(key)
        return (
          <div
            key={key}
            title={`${format(d, 'MMM d')}: ${done ? 'Done' : 'Not done'}`}
            className={cn(
              'h-3 w-3 rounded-[4px] border',
              done ? 'bg-emerald-500/80 border-emerald-500/40' : 'bg-muted/40 border-border'
            )}
          />
        )
      })}
    </div>
  )
}

function HabitCard({
  habit,
  onSelect,
  selected,
  isDoneToday,
  streak,
  onCheckIn,
}: {
  habit: Habit
  onSelect: () => void
  selected: boolean
  isDoneToday: boolean
  streak: number
  onCheckIn: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-all hover:shadow-md',
        selected ? 'border-primary bg-primary/5' : 'bg-card'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold">
            <span className="mr-2">{habit.icon ?? '✨'}</span>
            {habit.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {habit.frequency} · target {habit.target_count}/{habit.period}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-semibold text-orange-500">
            <Flame className="h-4 w-4" />
            {streak}
          </div>
          <Button
            type="button"
            size="sm"
            variant={isDoneToday ? 'secondary' : 'default'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCheckIn()
            }}
          >
            {isDoneToday ? 'Done' : 'Check in'}
          </Button>
        </div>
      </div>
    </button>
  )
}

export function HabitsPage() {
  const { data: habits, isLoading } = useHabits()
  const createHabit = useCreateHabit()
  const checkIn = useHabitCheckIn()

  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('✨')

  const selectedHabit = habits?.find((h) => h.id === selectedHabitId) ?? null
  const { data: completions, isLoading: completionsLoading } = useHabitCompletions(selectedHabitId)

  const doneSet = useMemo(() => new Set((completions ?? []).map((c) => c.completed_at.slice(0, 10))), [completions])
  const doneToday = doneSet.has(format(new Date(), 'yyyy-MM-dd'))
  const streak = computeStreak(completions ?? [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    const habit = await createHabit.mutateAsync({ name: newName.trim(), icon: newIcon })
    setNewName('')
    setSelectedHabitId(habit.id)
  }

  const handleCheckIn = async (habitId: string) => {
    await checkIn.mutateAsync(habitId)
  }

  return (
    <>
      <PageHeader
        title="Habits"
        description="Build consistency with streaks and a 90‑day heatmap."
        actions={
          <div className="flex items-center gap-2">
            <Input
              placeholder="New habit name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-56"
            />
            <Input
              placeholder="✨"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-16 text-center"
            />
            <Button onClick={handleCreate} disabled={!newName.trim() || createHabit.isPending}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : !habits || habits.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          title="No habits yet"
          description="Create your first habit above to start tracking."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {habits.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                selected={h.id === selectedHabitId}
                onSelect={() => setSelectedHabitId(h.id)}
                isDoneToday={h.id === selectedHabitId ? doneToday : false}
                streak={h.id === selectedHabitId ? streak : 0}
                onCheckIn={() => handleCheckIn(h.id)}
              />
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Heatmap (90 days)</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedHabit ? (
                  <EmptyState title="Select a habit" description="Pick a habit to view its history." className="py-6" />
                ) : completionsLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium">{selectedHabit.icon ?? '✨'} {selectedHabit.name}</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-orange-500">
                        <Flame className="h-4 w-4" />
                        {streak}
                      </div>
                    </div>
                    <Heatmap completions={completions ?? []} />
                    <p className="mt-3 text-xs text-muted-foreground">
                      Tip: Click “Check in” daily to build a streak.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

