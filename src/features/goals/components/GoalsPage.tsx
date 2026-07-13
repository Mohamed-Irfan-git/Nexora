import { useMemo, useState } from 'react'
import { Target, Plus, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ProgressRing } from '@/components/data-display/ProgressRing'
import { useCreateGoal, useCreateMilestone, useGoals, useMilestones, useToggleMilestone, useUpdateGoal } from '@/features/goals/hooks/useGoals'
import type { Goal } from '@/features/goals/types/goal.types'

export function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const selectedGoal = useMemo(() => goals.find((g) => g.id === selectedGoalId) ?? null, [goals, selectedGoalId])
  const { data: milestones = [] } = useMilestones(selectedGoalId)
  const createMilestone = useCreateMilestone(selectedGoalId)
  const toggleMilestone = useToggleMilestone(selectedGoalId)

  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [milestoneTitle, setMilestoneTitle] = useState('')

  const milestoneProgress = selectedGoal && milestones.length > 0
    ? Math.round((milestones.filter((m) => m.is_completed).length / milestones.length) * 100)
    : selectedGoal?.progress ?? 0

  const addGoal = async () => {
    if (!title.trim()) return
    const goal = await createGoal.mutateAsync({ title: title.trim(), icon })
    setSelectedGoalId(goal.id)
    setTitle('')
  }

  const syncGoalProgress = async (goal: Goal, nextProgress: number) => {
    if (goal.progress !== nextProgress) {
      await updateGoal.mutateAsync({ goalId: goal.id, updates: { progress: nextProgress } })
    }
  }

  return (
    <>
      <PageHeader
        title="Goals"
        description="Track milestones and long-term progress."
        actions={
          <div className="flex items-center gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New goal" className="w-52" />
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-16 text-center" />
            <Button onClick={addGoal} disabled={!title.trim() || createGoal.isPending}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading goals...</CardContent></Card>
      ) : goals.length === 0 ? (
        <EmptyState icon={<Target className="h-5 w-5 text-primary" />} title="No goals yet" description="Create a goal to start tracking progress." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all hover:shadow-md ${goal.id === selectedGoalId ? 'border-primary bg-primary/5' : 'bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{goal.icon ?? '🎯'} {goal.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{goal.type.replace('_', ' ')} · {goal.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressRing progress={goal.progress} size={42} strokeWidth={4} />
                    <span className="text-sm font-semibold">{goal.progress}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedGoal ? 'Milestones' : 'Select a goal'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedGoal ? (
                <EmptyState title="Pick a goal" description="Select a goal to manage milestones." className="py-6" />
              ) : (
                <>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{selectedGoal.icon ?? '🎯'} {selectedGoal.title}</p>
                      <span className="text-xs text-muted-foreground">{milestoneProgress}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      placeholder="Add milestone"
                    />
                    <Button
                      onClick={async () => {
                        if (!milestoneTitle.trim()) return
                        await createMilestone.mutateAsync(milestoneTitle.trim())
                        setMilestoneTitle('')
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {milestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        onClick={async () => {
                          await toggleMilestone.mutateAsync(milestone)
                          const nextCompleted = milestone.is_completed
                            ? milestones.filter((m) => m.is_completed).length - 1
                            : milestones.filter((m) => m.is_completed).length + 1
                          const nextProgress = milestones.length > 0 ? Math.round((nextCompleted / milestones.length) * 100) : 0
                          await syncGoalProgress(selectedGoal, nextProgress)
                        }}
                        className="flex w-full items-center gap-2 rounded-xl border p-3 text-left hover:border-primary/30"
                      >
                        {milestone.is_completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={milestone.is_completed ? 'line-through text-muted-foreground' : ''}>{milestone.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
