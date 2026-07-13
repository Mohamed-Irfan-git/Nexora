import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTask } from '@/features/tasks/hooks/useTasks'
import { useToast } from '@/hooks/use-toast'

export function QuickAddBar() {
  const [title, setTitle] = useState('')
  const [expanded, setExpanded] = useState(false)
  const createTask = useCreateTask()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await createTask.mutateAsync({ title: title.trim() })
      setTitle('')
      setExpanded(false)
      toast({ title: 'Task created', description: title.trim() })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to create task',
        description: err instanceof Error ? err.message : 'Please try again',
      })
    }
  }

  if (!expanded) {
    return (
      <Button
        onClick={() => setExpanded(true)}
        className="fixed bottom-20 right-4 z-40 h-12 gap-2 rounded-full px-5 shadow-lg shadow-primary/25 md:bottom-6"
      >
        <Plus className="h-5 w-5" />
        Quick add
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-20 right-4 left-4 z-40 flex gap-2 rounded-2xl border bg-card p-3 shadow-xl md:bottom-6 md:left-auto md:w-96"
    >
      <Input
        autoFocus
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => !title && setExpanded(false)}
      />
      <Button type="submit" size="icon" disabled={createTask.isPending || !title.trim()}>
        {createTask.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
      </Button>
    </form>
  )
}
