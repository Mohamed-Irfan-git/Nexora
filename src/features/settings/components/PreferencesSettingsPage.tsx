import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function PreferencesSettingsPage() {
  const { profile, updateProfile } = useAuthContext()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [timezone, setTimezone] = useState(profile?.timezone ?? 'UTC')
  const [currency, setCurrency] = useState(profile?.currency ?? 'USD')
  const [dateFormat, setDateFormat] = useState(profile?.date_format ?? 'MMM d, yyyy')

  const save = async () => {
    setSaving(true)
    try {
      await updateProfile({ timezone, currency, date_format: dateFormat })
      toast({ title: 'Preferences saved' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: err instanceof Error ? err.message : 'Could not save preferences',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Timezone, currency, and display options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Timezone</p>
              <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Asia/Kolkata" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Currency</p>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Date format</p>
            <Input value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} placeholder="MMM d, yyyy" />
            <p className="text-xs text-muted-foreground">Example: MMM d, yyyy → Jul 13, 2026</p>
          </div>
          <Button onClick={save} disabled={saving}>
            Save preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

