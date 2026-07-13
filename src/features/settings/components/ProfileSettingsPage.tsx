import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { uploadAvatar } from '@/lib/supabase/storage'
import { getInitials } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

type ProfileForm = {
  full_name: string
  bio: string
  timezone: string
  currency: string
}

export function ProfileSettingsPage() {
  const { user, profile, updateProfile } = useAuthContext()
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      full_name: profile?.full_name ?? '',
      bio: profile?.bio ?? '',
      timezone: profile?.timezone ?? 'UTC',
      currency: profile?.currency ?? 'USD',
    },
    values: {
      full_name: profile?.full_name ?? '',
      bio: profile?.bio ?? '',
      timezone: profile?.timezone ?? 'UTC',
      currency: profile?.currency ?? 'USD',
    },
  })

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Max size is 2MB' })
      return
    }
    setUploading(true)
    try {
      const url = await uploadAvatar(user.id, file)
      await updateProfile({ avatar_url: url })
      toast({ title: 'Avatar updated' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload avatar',
      })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    try {
      await updateProfile(data)
      toast({ title: 'Profile saved' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: err instanceof Error ? err.message : 'Could not save profile',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Upload a profile photo (max 2MB)</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(profile?.full_name || profile?.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </div>
          <div>
            <p className="font-medium">{profile?.full_name || 'No name set'}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" {...register('full_name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="A short bio..." {...register('bio')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" {...register('timezone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...register('currency')} />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
