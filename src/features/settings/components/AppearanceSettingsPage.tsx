import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/hooks/use-theme'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { cn } from '@/lib/utils/cn'

const themes = [
  { id: 'light' as const, label: 'Light', icon: Sun, preview: 'bg-white border' },
  { id: 'dark' as const, label: 'Dark', icon: Moon, preview: 'bg-slate-900 border-slate-700' },
  { id: 'system' as const, label: 'System', icon: Monitor, preview: 'bg-gradient-to-br from-white to-slate-900 border' },
]

export function AppearanceSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { updateProfile } = useAuthContext()

  const handleThemeChange = async (next: 'light' | 'dark' | 'system') => {
    setTheme(next)
    try {
      await updateProfile({ theme: next })
    } catch {
      // theme still applied locally
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose how Nexora looks. Currently using {resolvedTheme} mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {themes.map(({ id, label, icon: Icon, preview }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleThemeChange(id)}
                className={cn(
                  'relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all hover:shadow-md',
                  theme === id ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/30 hover:border-border'
                )}
              >
                {theme === id && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className={cn('h-16 w-full rounded-xl border', preview)} />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
