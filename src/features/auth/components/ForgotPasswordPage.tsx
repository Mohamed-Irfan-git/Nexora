import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schemas/auth.schemas'
import { ROUTES } from '@/lib/constants/routes'
import { useToast } from '@/hooks/use-toast'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuthContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    try {
      await resetPassword(data.email)
      setSent(true)
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Request failed',
        description: err instanceof Error ? err.message : 'Could not send reset email',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Your productivity, elevated." subtitle="Reset your password">
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, you&apos;ll receive a reset link shortly.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to={ROUTES.login}>Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Send reset link
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to={ROUTES.login}>Back to sign in</Link>
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
