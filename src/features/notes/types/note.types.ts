export type NoteFolder = {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Note = {
  id: string
  user_id: string
  folder_id: string | null
  title: string
  content: Record<string, unknown> | null
  content_text: string | null
  format: 'rich' | 'markdown'
  is_pinned: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}
