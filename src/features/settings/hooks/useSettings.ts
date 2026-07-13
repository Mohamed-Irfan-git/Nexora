import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import {
  exportUserData,
  fetchUserSettings,
  importUserData,
  updateUserSettings,
} from '@/features/settings/api/settings.api'
import type { UserSettings } from '@/features/settings/api/settings.api'

export const settingsKeys = {
  all: ['settings'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
}

export function useUserSettings() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: settingsKeys.user(),
    queryFn: () => fetchUserSettings(user!.id),
    enabled: !!user,
  })
}

export function useUpdateUserSettings() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (updates: Partial<UserSettings>) => updateUserSettings(user!.id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.all }),
  })
}

export function useExportData() {
  const { user } = useAuthContext()
  return useMutation({
    mutationFn: () => exportUserData(user!.id),
  })
}

export function useImportData() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown[]>) => importUserData(user!.id, payload),
    onSuccess: () => {
      qc.invalidateQueries()
    },
  })
}

