import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Repeat,
  Target,
  Wallet,
  FileText,
  BarChart3,
  FileBarChart,
  Settings,
  LogOut,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageTransition } from '@/components/layout/PageTransition'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROUTES } from '@/lib/constants/routes'
import { useTheme } from '@/hooks/use-theme'
import { getInitials } from '@/lib/utils/cn'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.tasks, label: 'Tasks', icon: CheckSquare },
  { to: ROUTES.calendar, label: 'Calendar', icon: Calendar },
  { to: ROUTES.habits, label: 'Habits', icon: Repeat },
  { to: ROUTES.goals, label: 'Goals', icon: Target },
  { to: ROUTES.expenses, label: 'Expenses', icon: Wallet },
  { to: ROUTES.notes, label: 'Notes', icon: FileText },
  { to: ROUTES.analytics, label: 'Analytics', icon: BarChart3 },
  { to: ROUTES.reports, label: 'Reports', icon: FileBarChart },
]

const mobileNavItems = [
  { to: ROUTES.dashboard, label: 'Home', icon: LayoutDashboard },
  { to: ROUTES.tasks, label: 'Tasks', icon: CheckSquare },
  { to: ROUTES.calendar, label: 'Calendar', icon: Calendar },
  { to: ROUTES.expenses, label: 'Money', icon: Wallet },
  { to: ROUTES.settingsProfile, label: 'More', icon: Settings },
]

export function AppShell() {
  const { profile, signOut } = useAuthContext()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="glass hidden w-[17.5rem] shrink-0 flex-col border-r lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-border/60 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-[-0.04em]">Nexora</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Your daily flow</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">Workspace</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <div className="my-4 h-px bg-border/70" />
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">Account</p>
          <NavLink
            to={ROUTES.settingsProfile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'
              )
            }
          >
            <Settings className="h-4 w-4" />
            Settings
          </NavLink>
        </nav>
        <div className="border-t border-border/60 p-4">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={toggleTheme}>
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'system' ? 'System theme' : resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="glass absolute left-0 top-0 flex h-full w-72 flex-col border-r shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold">Nexora</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {[...navItems, { to: ROUTES.settingsProfile, label: 'Settings', icon: Settings }].map(
                ({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                )
              )}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        <header className="glass sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/60 px-4 md:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm font-semibold text-muted-foreground">Personal workspace</span>
          </div>
          <div className="lg:hidden" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/60 bg-card/60 shadow-sm">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? 'User'} />
                  <AvatarFallback>{getInitials(profile?.full_name || profile?.email || 'U')}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.full_name || 'User'}</span>
                  <span className="text-xs font-normal text-muted-foreground">{profile?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(ROUTES.settingsProfile)}>Profile settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.settingsPreferences)}>Preferences</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.settingsNotifications)}>Notifications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.settingsData)}>Data</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.settingsAppearance)}>Appearance</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>Toggle theme</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <AnimatePresence mode="wait">
              <PageTransition routeKey={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>

        <nav className="glass fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border/60 px-2 py-2 lg:hidden">
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
