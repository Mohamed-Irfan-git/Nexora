import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { createNote, createNoteFolder, fetchNoteFolders, fetchNotes, updateNote } from '@/features/notes/api/notes.api'
import type { Note } from '@/features/notes/types/note.types'

export const noteKeys = {
  all: ['notes'] as const,
  list: (search: string) => [...noteKeys.all, 'list', search] as const,
  folders: () => [...noteKeys.all, 'folders'] as const,
}

export function useNotes(search = '') {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: noteKeys.list(search),
    queryFn: () => fetchNotes(user!.id, search),
    enabled: !!user,
  })
}

export function useNoteFolders() {
  const { user } = useAuthContext()
  return useQuery({
    queryKey: noteKeys.folders(),
    queryFn: () => fetchNoteFolders(user!.id),
    enabled: !!user,
  })
}

export function useCreateNote() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { title: string; folder_id?: string | null }) => createNote(user!.id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useUpdateNote() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, updates }: { noteId: string; updates: Partial<Note> }) =>
      updateNote(user!.id, noteId, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useCreateFolder() {
  const { user } = useAuthContext()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createNoteFolder(user!.id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.folders() }),
  })
}
