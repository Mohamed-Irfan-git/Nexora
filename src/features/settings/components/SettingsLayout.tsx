import { NavLink, Outlet } from 'react-router-dom'
import { Palette, User } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

const settingsNav = [
  { to: ROUTES.settingsProfile, label: 'Profile', icon: User },
  { to: ROUTES.settingsAppearance, label: 'Appearance', icon: Palette },
]

export function SettingsLayout() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex gap-2 md:w-48 md:flex-col">
          {settingsNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
