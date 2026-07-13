import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROUTES } from '@/lib/constants/routes'

export function AuthGuard() {
  const { user, loading } = useAuthContext()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  if (!user.email_confirmed_at && location.pathname !== ROUTES.verifyEmail) {
    return <Navigate to={ROUTES.verifyEmail} replace />
  }

  return <Outlet />
}

export function GuestGuard() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
