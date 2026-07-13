import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROUTES } from '@/lib/constants/routes'
import { useToast } from '@/hooks/use-toast'

export function VerifyEmailPage() {
  const { user, resendVerification } = useAuthContext()
  const { toast } = useToast()

  const handleResend = async () => {
    try {
      await resendVerification()
      toast({ title: 'Email sent', description: 'Check your inbox for a new verification link.' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Could not resend',
        description: err instanceof Error ? err.message : 'Please try again later',
      })
    }
  }

  return (
    <AuthLayout title="Your productivity, elevated." subtitle="Verify your email address">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          {user?.email
            ? `We sent a verification link to ${user.email}. Please check your inbox.`
            : 'Please check your email for a verification link.'}
        </p>
        <Button variant="outline" onClick={handleResend}>
          Resend verification email
        </Button>
        <Button asChild variant="ghost">
          <Link to={ROUTES.dashboard}>Continue to dashboard</Link>
        </Button>
      </div>
    </AuthLayout>
  )
}
