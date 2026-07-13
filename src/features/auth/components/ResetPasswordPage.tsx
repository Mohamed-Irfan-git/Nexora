import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/features/auth/schemas/auth.schemas'
import { ROUTES } from '@/lib/constants/routes'
import { useToast } from '@/hooks/use-toast'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { updatePassword } = useAuthContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true)
    try {
      await updatePassword(data.password)
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' })
      navigate(ROUTES.dashboard)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Could not update password',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Your productivity, elevated." subtitle="Choose a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
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
          Update password
        </Button>
      </form>
    </AuthLayout>
  )
}
