import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard, GuestGuard } from '@/features/auth/components/AuthGuard'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { RegisterPage } from '@/features/auth/components/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/components/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/components/ResetPasswordPage'
import { VerifyEmailPage } from '@/features/auth/components/VerifyEmailPage'
import { AppShell } from '@/components/layout/AppShell'
import { PlaceholderPage } from '@/components/feedback/PlaceholderPage'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'
import { SettingsLayout } from '@/features/settings/components/SettingsLayout'
import { ProfileSettingsPage } from '@/features/settings/components/ProfileSettingsPage'
import { AppearanceSettingsPage } from '@/features/settings/components/AppearanceSettingsPage'
import { ROUTES } from '@/lib/constants/routes'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.dashboard} replace />} />

      <Route element={<GuestGuard />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
        <Route element={<AppShell />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.tasks} element={<PlaceholderPage title="Tasks" description="Full task management — coming in Phase 4" />} />
          <Route path={ROUTES.calendar} element={<PlaceholderPage title="Calendar" description="Calendar views — coming in Phase 5" />} />
          <Route path={ROUTES.habits} element={<PlaceholderPage title="Habits" description="Habit tracking — coming in Phase 5" />} />
          <Route path={ROUTES.goals} element={<PlaceholderPage title="Goals" description="Goal tracking — coming in Phase 6" />} />
          <Route path={ROUTES.expenses} element={<PlaceholderPage title="Expenses" description="Expense tracker — coming in Phase 6" />} />
          <Route path={ROUTES.notes} element={<PlaceholderPage title="Notes" description="Notes — coming in Phase 7" />} />
          <Route path={ROUTES.analytics} element={<PlaceholderPage title="Analytics" description="Analytics — coming in Phase 7" />} />
          <Route path={ROUTES.reports} element={<PlaceholderPage title="Reports" description="Reports — coming in Phase 7" />} />
          <Route path={ROUTES.settings} element={<Navigate to={ROUTES.settingsProfile} replace />} />
          <Route element={<SettingsLayout />}>
            <Route path={ROUTES.settingsProfile} element={<ProfileSettingsPage />} />
            <Route path={ROUTES.settingsAppearance} element={<AppearanceSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
