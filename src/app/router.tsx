import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard, GuestGuard } from '@/features/auth/components/AuthGuard'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { RegisterPage } from '@/features/auth/components/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/components/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/components/ResetPasswordPage'
import { VerifyEmailPage } from '@/features/auth/components/VerifyEmailPage'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'
import { TasksPage } from '@/features/tasks/components/TasksPage'
import { ArchivedTasksPage } from '@/features/tasks/components/ArchivedTasksPage'
import { TrashedTasksPage } from '@/features/tasks/components/TrashedTasksPage'
import { CalendarPage } from '@/features/calendar/components/CalendarPage'
import { HabitsPage } from '@/features/habits/components/HabitsPage'
import { GoalsPage } from '@/features/goals/components/GoalsPage'
import { ExpensesPage } from '@/features/expenses/components/ExpensesPage'
import { NotesPage } from '@/features/notes/components/NotesPage'
import { AnalyticsPage } from '@/features/analytics/components/AnalyticsPage'
import { ReportsPage } from '@/features/reports/components/ReportsPage'
import { SettingsLayout } from '@/features/settings/components/SettingsLayout'
import { ProfileSettingsPage } from '@/features/settings/components/ProfileSettingsPage'
import { AppearanceSettingsPage } from '@/features/settings/components/AppearanceSettingsPage'
import { PreferencesSettingsPage } from '@/features/settings/components/PreferencesSettingsPage'
import { NotificationsSettingsPage } from '@/features/settings/components/NotificationsSettingsPage'
import { DataSettingsPage } from '@/features/settings/components/DataSettingsPage'
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
          <Route path={ROUTES.tasks} element={<TasksPage />} />
          <Route path={ROUTES.tasksArchive} element={<ArchivedTasksPage />} />
          <Route path={ROUTES.tasksTrash} element={<TrashedTasksPage />} />
          <Route path={ROUTES.calendar} element={<CalendarPage />} />
          <Route path={ROUTES.habits} element={<HabitsPage />} />
          <Route path={ROUTES.goals} element={<GoalsPage />} />
          <Route path={ROUTES.expenses} element={<ExpensesPage />} />
          <Route path={ROUTES.notes} element={<NotesPage />} />
          <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
          <Route path={ROUTES.reports} element={<ReportsPage />} />
          <Route path={ROUTES.settings} element={<Navigate to={ROUTES.settingsProfile} replace />} />
          <Route element={<SettingsLayout />}>
            <Route path={ROUTES.settingsProfile} element={<ProfileSettingsPage />} />
            <Route path={ROUTES.settingsAppearance} element={<AppearanceSettingsPage />} />
            <Route path={ROUTES.settingsPreferences} element={<PreferencesSettingsPage />} />
            <Route path={ROUTES.settingsNotifications} element={<NotificationsSettingsPage />} />
            <Route path={ROUTES.settingsData} element={<DataSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
