import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { OAuthButtons } from '@/features/auth/components/OAuthButtons'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schemas'
import { ROUTES } from '@/lib/constants/routes'
import { useToast } from '@/hooks/use-toast'

export function LoginPage() {
  const navigate = useNavigate()
  const { signInWithEmail } = useAuthContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      await signInWithEmail(data.email, data.password)
      navigate(ROUTES.dashboard)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: err instanceof Error ? err.message : 'Invalid credentials',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Your productivity, elevated." subtitle="Welcome back. Sign in to continue.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to={ROUTES.forgotPassword} className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
      <div className="mt-6">
        <OAuthButtons />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.register} className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
