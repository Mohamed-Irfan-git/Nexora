import { supabase } from '@/lib/supabase/client'
import type { Note, NoteFolder } from '@/features/notes/types/note.types'

export async function fetchNotes(userId: string, search = ''): Promise<Note[]> {
  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,content_text.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Note[]
}

export async function fetchNoteFolders(userId: string): Promise<NoteFolder[]> {
  const { data, error } = await supabase
    .from('note_folders')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as NoteFolder[]
}

export async function createNote(userId: string, input: { title: string; folder_id?: string | null }): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      title: input.title || 'Untitled',
      folder_id: input.folder_id ?? null,
      content: { type: 'doc', text: '' },
      content_text: '',
      format: 'markdown',
      is_pinned: false,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Note
}

export async function updateNote(userId: string, noteId: string, updates: Partial<Note>): Promise<void> {
  const { error } = await supabase.from('notes').update(updates).eq('id', noteId).eq('user_id', userId)
  if (error) throw error
}

export async function createNoteFolder(userId: string, name: string): Promise<NoteFolder> {
  const { data, error } = await supabase
    .from('note_folders')
    .insert({ user_id: userId, name, sort_order: 0 })
    .select('*')
    .single()
  if (error) throw error
  return data as NoteFolder
}
