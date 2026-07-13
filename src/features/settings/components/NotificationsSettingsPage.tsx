import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useUpdateUserSettings, useUserSettings } from '@/features/settings/hooks/useSettings'

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`h-6 w-11 rounded-full p-1 transition-colors ${value ? 'bg-primary' : 'bg-muted'}`}
        aria-pressed={value}
      >
        <div className={`h-4 w-4 rounded-full bg-background transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

export function NotificationsSettingsPage() {
  const { toast } = useToast()
  const { data: settings, isLoading } = useUserSettings()
  const update = useUpdateUserSettings()

  const setField = async (key: string, next: boolean) => {
    try {
      await update.mutateAsync({ [key]: next })
      toast({ title: 'Updated' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Could not update setting',
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Notification preferences are not available yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => update.mutateAsync({})}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose which alerts Nexora should show.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            label="Email notifications"
            description="Account and security emails."
            value={settings.email_notifications}
            onChange={(v) => setField('email_notifications', v)}
          />
          <ToggleRow
            label="Push notifications"
            description="Enable push notifications (UI only for now)."
            value={settings.push_notifications}
            onChange={(v) => setField('push_notifications', v)}
          />
          <ToggleRow
            label="Task reminders"
            description="Reminders for upcoming deadlines."
            value={settings.task_reminders}
            onChange={(v) => setField('task_reminders', v)}
          />
          <ToggleRow
            label="Habit reminders"
            description="Nudges to keep streaks going."
            value={settings.habit_reminders}
            onChange={(v) => setField('habit_reminders', v)}
          />
          <ToggleRow
            label="Budget alerts"
            description="Warn when budgets are exceeded."
            value={settings.budget_alerts}
            onChange={(v) => setField('budget_alerts', v)}
          />
          <ToggleRow
            label="Weekly report"
            description="Weekly summary email (report generation added in Phase 7)."
            value={settings.weekly_report}
            onChange={(v) => setField('weekly_report', v)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

