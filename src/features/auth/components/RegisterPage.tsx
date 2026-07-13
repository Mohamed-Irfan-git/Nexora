import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { OAuthButtons } from '@/features/auth/components/OAuthButtons'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/auth.schemas'
import { ROUTES } from '@/lib/constants/routes'
import { useToast } from '@/hooks/use-toast'

export function RegisterPage() {
  const { signUpWithEmail } = useAuthContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      await signUpWithEmail(data.email, data.password, data.fullName)
      setSent(true)
      toast({
        title: 'Check your email',
        description: 'We sent you a verification link to complete registration.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: err instanceof Error ? err.message : 'Could not create account',
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Your productivity, elevated." subtitle="Almost there!">
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification link to your email. Click the link to activate your account.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to={ROUTES.login}>Back to sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Your productivity, elevated." subtitle="Create your Nexora account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" placeholder="Jane Doe" autoComplete="name" {...register('fullName')} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
      <div className="mt-6">
        <OAuthButtons />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
