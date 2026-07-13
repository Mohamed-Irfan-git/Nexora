import { useEffect, useMemo, useState } from 'react'
import { FolderPlus, Pin, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useCreateFolder, useCreateNote, useNoteFolders, useNotes, useUpdateNote } from '@/features/notes/hooks/useNotes'

export function NotesPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [folderName, setFolderName] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [draftTitle, setDraftTitle] = useState('')
  const [draftText, setDraftText] = useState('')

  const { data: notes = [], isLoading } = useNotes(search)
  const { data: folders = [] } = useNoteFolders()
  const createNote = useCreateNote()
  const createFolder = useCreateFolder()
  const updateNote = useUpdateNote()

  const selected = useMemo(() => notes.find((n) => n.id === selectedId) ?? null, [notes, selectedId])

  useEffect(() => {
    if (!selected && notes.length > 0) setSelectedId(notes[0].id)
  }, [notes, selected])

  useEffect(() => {
    setDraftTitle(selected?.title ?? '')
    setDraftText(selected?.content_text ?? '')
  }, [selectedId, selected?.title, selected?.content_text])

  useEffect(() => {
    if (!selected) return
    const timeout = window.setTimeout(() => {
      if (draftTitle !== selected.title || draftText !== (selected.content_text ?? '')) {
        void updateNote.mutate({
          noteId: selected.id,
          updates: {
            title: draftTitle || 'Untitled',
            content_text: draftText,
            content: { type: 'doc', text: draftText },
          },
        })
      }
    }, 600)
    return () => window.clearTimeout(timeout)
  }, [draftTitle, draftText, selected, updateNote])

  return (
    <>
      <PageHeader
        title="Notes"
        description="Capture ideas, markdown, links, and code snippets."
        actions={
          <div className="flex items-center gap-2">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New note title" className="w-52" />
            <Button
              onClick={async () => {
                const note = await createNote.mutateAsync({ title: newTitle || 'Untitled' })
                setNewTitle('')
                setSelectedId(note.id)
              }}
            >
              <Plus className="h-4 w-4" />
              New note
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Folders
              <FolderPlus className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder name" />
              <Button
                size="sm"
                onClick={async () => {
                  if (!folderName.trim()) return
                  await createFolder.mutateAsync(folderName.trim())
                  setFolderName('')
                }}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {folders.map((folder) => (
                <div key={folder.id} className="rounded-xl border px-3 py-2 text-sm">
                  {folder.name}
                </div>
              ))}
              {folders.length === 0 && <p className="text-sm text-muted-foreground">No folders yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="pl-9" />
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            ) : notes.length === 0 ? (
              <EmptyState title="No notes yet" description="Create your first note to get started." className="py-8" />
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedId(note.id)}
                    className={`w-full rounded-xl border p-3 text-left ${selectedId === note.id ? 'border-primary bg-primary/5' : 'hover:border-primary/20'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{note.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{note.content_text || 'Empty note'}</p>
                      </div>
                      {note.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{selected ? 'Editor' : 'Select a note'}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selected ? (
              <EmptyState title="Choose a note" description="Select a note from the list to start editing." className="py-12" />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Title" />
                  <Button
                    variant={selected.is_pinned ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => updateNote.mutate({ noteId: selected.id, updates: { is_pinned: !selected.is_pinned } })}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder={'# Markdown supported\n\nWrite notes, code blocks, links, and ideas here...'}
                  className="min-h-[520px] w-full rounded-2xl border bg-background p-4 text-sm outline-none"
                />
                <p className="text-xs text-muted-foreground">Autosaves after you stop typing. Markdown-style editing is supported.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
