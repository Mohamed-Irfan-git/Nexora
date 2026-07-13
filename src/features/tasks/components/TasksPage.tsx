import { useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Kanban,
  LayoutList,
  Table2,
  Plus,
  Search,
  Archive,
  Trash2,
  Filter,
  GripVertical,
} from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { BadgePriority, BadgeStatus } from '@/components/data-display/BadgePriority'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import type { Task, TaskPriority, TaskStatus } from '@/features/tasks/types/task.types'
import {
  useTasks,
  useCreateTask,
  useUpdateTaskStatus,
  useUpdateTask,
  useArchiveTask,
  useTrashTask,
  useBulkUpdateTaskStatus,
} from '@/features/tasks/hooks/useTasks'

type TaskView = 'list' | 'kanban' | 'table' | 'calendar'

const VIEWS: Array<{ id: TaskView; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: 'list', label: 'List', icon: LayoutList },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'table', label: 'Table', icon: Table2 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
]

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'completed', 'cancelled']
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'critical']

function KanbanColumn({
  status,
  children,
}: {
  status: TaskStatus
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div ref={setNodeRef} className={cn('min-h-[120px] space-y-2 rounded-lg', isOver && 'bg-primary/5')}>
      {children}
    </div>
  )
}

function SortableTaskRow({
  task,
  selected,
  onSelect,
  onOpen,
}: {
  task: Task
  selected: boolean
  onSelect: (taskId: string, checked: boolean) => void
  onOpen: (task: Task) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[32px_1fr_120px_120px_120px_56px] items-center gap-2 rounded-xl border bg-card px-3 py-2"
    >
      <input type="checkbox" checked={selected} onChange={(e) => onSelect(task.id, e.target.checked)} />
      <button onClick={() => onOpen(task)} className="truncate text-left text-sm font-medium hover:text-primary">
        {task.emoji ? `${task.emoji} ` : ''}
        {task.title}
      </button>
      <BadgeStatus status={task.status} />
      <BadgePriority priority={task.priority} />
      <span className="text-xs text-muted-foreground">{task.deadline ? format(parseISO(task.deadline), 'MMM d') : '-'}</span>
      <button className="justify-self-end text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>
    </div>
  )
}

function TaskEditor({
  task,
  onClose,
  onSave,
}: {
  task: Task | null
  onClose: () => void
  onSave: (taskId: string, updates: Partial<Task>) => Promise<void>
}) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo')
  const [deadline, setDeadline] = useState(task?.deadline?.slice(0, 10) ?? '')

  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Task details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          <Input value={description ?? ''} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="h-10 rounded-xl border bg-background px-3 text-sm"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="h-10 rounded-xl border bg-background px-3 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onSave(task.id, {
                  title,
                  description,
                  priority,
                  status,
                  deadline: deadline ? new Date(deadline).toISOString() : null,
                })
                onClose()
              }}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateStatus = useUpdateTaskStatus()
  const updateTask = useUpdateTask()
  const archiveTask = useArchiveTask()
  const trashTask = useTrashTask()
  const bulkUpdate = useBulkUpdateTaskStatus()

  const [view, setView] = useState<TaskView>('list')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')
  const [newTitle, setNewTitle] = useState('')
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
  const [detailTask, setDetailTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQuery =
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        (t.description ?? '').toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
      return matchesQuery && matchesStatus && matchesPriority
    })
  }, [tasks, query, statusFilter, priorityFilter])

  const grouped = useMemo(() => {
    return STATUSES.reduce<Record<TaskStatus, Task[]>>((acc, s) => {
      acc[s] = filtered.filter((t) => t.status === s)
      return acc
    }, {} as Record<TaskStatus, Task[]>)
  }, [filtered])

  function handleSelect(taskId: string, checked: boolean) {
    setSelectedTaskIds((prev) => (checked ? [...new Set([...prev, taskId])] : prev.filter((id) => id !== taskId)))
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const task = tasks.find((t) => t.id === active.id)
    const nextStatus = STATUSES.find((s) => s === over.id)
    if (task && nextStatus && task.status !== nextStatus) {
      await updateStatus.mutateAsync({ taskId: task.id, status: nextStatus })
    }
  }

  async function handleQuickAdd() {
    if (!newTitle.trim()) return
    await createTask.mutateAsync({ title: newTitle.trim() })
    setNewTitle('')
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Manage your work in list, board, table, and calendar views."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.tasksArchive}>Archive</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.tasksTrash}>Trash</Link>
            </Button>
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <Button key={id} variant={view === id ? 'default' : 'outline'} size="sm" onClick={() => setView(id)}>
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search tasks..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)}
              className="h-10 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}
              className="h-10 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="all">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-2 p-4 md:flex-row">
          <Input
            placeholder="Add a task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
          />
          <Button onClick={handleQuickAdd} disabled={createTask.isPending}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      {selectedTaskIds.length > 0 && (
        <Card className="mb-4 border-primary/40">
          <CardContent className="flex items-center justify-between p-3">
            <p className="text-sm">{selectedTaskIds.length} selected</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => bulkUpdate.mutate({ taskIds: selectedTaskIds, status: 'completed' })}>
                Mark completed
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedTaskIds([])}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Loading tasks...</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState title="No tasks found" description="Try adjusting filters or create a new task." />
      ) : (
        <>
          {view === 'list' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext items={filtered.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {filtered.map((task) => (
                    <SortableTaskRow
                      key={task.id}
                      task={task}
                      selected={selectedTaskIds.includes(task.id)}
                      onSelect={handleSelect}
                      onOpen={setDetailTask}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {view === 'table' && (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3">Task</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((task) => (
                      <tr key={task.id} className="border-t">
                        <td className="p-3">
                          <button onClick={() => setDetailTask(task)} className="hover:text-primary">
                            {task.title}
                          </button>
                        </td>
                        <td className="p-3">
                          <BadgeStatus status={task.status} />
                        </td>
                        <td className="p-3">
                          <BadgePriority priority={task.priority} />
                        </td>
                        <td className="p-3">{task.deadline ? format(parseISO(task.deadline), 'MMM d, yyyy') : '-'}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => archiveTask.mutate(task.id)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => trashTask.mutate(task.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {view === 'kanban' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {STATUSES.map((status) => (
                  <Card key={status}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm capitalize">{status.replace('_', ' ')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <SortableContext items={grouped[status].map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        <KanbanColumn status={status}>
                          {grouped[status].map((task) => (
                            <button
                              key={task.id}
                              onClick={() => setDetailTask(task)}
                              className="w-full rounded-xl border bg-card p-3 text-left hover:border-primary/40"
                            >
                              <p className="truncate text-sm font-medium">{task.title}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <BadgePriority priority={task.priority} />
                                <span className="text-xs text-muted-foreground">
                                  {task.deadline ? format(parseISO(task.deadline), 'MMM d') : '-'}
                                </span>
                              </div>
                            </button>
                          ))}
                        </KanbanColumn>
                      </SortableContext>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DndContext>
          )}

          {view === 'calendar' && (
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filtered
                    .filter((t) => t.deadline)
                    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
                    .map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setDetailTask(task)}
                        className="rounded-xl border p-3 text-left hover:border-primary/40"
                      >
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{format(parseISO(task.deadline!), 'EEEE, MMM d')}</p>
                        <div className="mt-2">
                          <BadgePriority priority={task.priority} />
                        </div>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <TaskEditor
        task={detailTask}
        onClose={() => setDetailTask(null)}
        onSave={async (taskId, updates) => {
          await updateTask.mutateAsync({ taskId, updates })
        }}
      />
    </>
  )
}
