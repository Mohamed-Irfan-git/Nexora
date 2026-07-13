import { useMemo, useState } from 'react'
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { cn } from '@/lib/utils/cn'
import { useMonthEvents, useCreateEvent, useUpdateEvent } from '@/features/calendar/hooks/useCalendar'
import { useTasks, useUpdateTask } from '@/features/tasks/hooks/useTasks'
import type { CalendarEvent } from '@/features/calendar/types/calendar.types'
import type { Task } from '@/features/tasks/types/task.types'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'

type CalendarMode = 'month' | 'week' | 'day' | 'agenda'

function DroppableDay({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={cn(className, isOver && 'ring-2 ring-primary/40')}>
      {children}
    </div>
  )
}

function DraggableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = { transform: CSS.Translate.toString(transform) }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

function EventPill({ event }: { event: CalendarEvent }) {
  return (
    <div className="truncate rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
      {event.title}
    </div>
  )
}

function DeadlinePill({ task }: { task: Task }) {
  return (
    <div className="truncate rounded-lg bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
      {task.title}
    </div>
  )
}

export function CalendarPage() {
  const [mode, setMode] = useState<CalendarMode>('month')
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [newTitle, setNewTitle] = useState('')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const { data: events = [], isLoading: eventsLoading } = useMonthEvents(cursor)
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const updateTask = useUpdateTask()

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
    const days: Date[] = []
    let d = start
    while (d <= end) {
      days.push(d)
      d = addDays(d, 1)
    }
    return days
  }, [cursor])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const key = e.start_at.slice(0, 10)
      map.set(key, [...(map.get(key) ?? []), e])
    }
    return map
  }, [events])

  const deadlinesByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const t of tasks) {
      if (!t.deadline) continue
      const key = t.deadline.slice(0, 10)
      map.set(key, [...(map.get(key) ?? []), t])
    }
    return map
  }, [tasks])

  const onAdd = async () => {
    if (!newTitle.trim()) return
    const day = selectedDay ?? new Date()
    const startAt = new Date(day)
    startAt.setHours(9, 0, 0, 0)
    await createEvent.mutateAsync({ title: newTitle.trim(), start_at: startAt.toISOString(), end_at: null })
    setNewTitle('')
  }

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    const overDay = String(over.id) // yyyy-mm-dd

    const activeId = String(active.id)
    if (activeId.startsWith('event:')) {
      const eventId = activeId.replace('event:', '')
      const ev = events.find((x) => x.id === eventId)
      if (!ev) return
      const next = new Date(overDay)
      const prev = parseISO(ev.start_at)
      next.setHours(prev.getHours(), prev.getMinutes(), 0, 0)
      await updateEvent.mutateAsync({ eventId, updates: { start_at: next.toISOString() } })
    }

    if (activeId.startsWith('task:')) {
      const taskId = activeId.replace('task:', '')
      const t = tasks.find((x) => x.id === taskId)
      if (!t) return
      const next = new Date(overDay)
      next.setHours(18, 0, 0, 0)
      await updateTask.mutateAsync({ taskId, updates: { deadline: next.toISOString() } })
    }
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="See events and task deadlines together."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCursor(subMonths(cursor, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(startOfMonth(new Date()))}>
              <CalendarDays className="h-4 w-4" />
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="mx-2 hidden text-sm font-semibold md:block">{format(cursor, 'MMMM yyyy')}</div>
            <div className="ml-2 flex gap-2">
              {(['month', 'week', 'day', 'agenda'] as CalendarMode[]).map((m) => (
                <Button key={m} size="sm" variant={mode === m ? 'default' : 'outline'} onClick={() => setMode(m)}>
                  {m}
                </Button>
              ))}
            </div>
          </div>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center">
          <Input
            value={newTitle}
            onChange={(ev) => setNewTitle(ev.target.value)}
            placeholder="Quick add event (select a day, then add)"
          />
          <Button onClick={onAdd} disabled={!newTitle.trim() || createEvent.isPending}>
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        </CardContent>
      </Card>

      {mode !== 'month' && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">View mode</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Week/Day/Agenda are simplified for now; Month view is the primary view in Phase 5.
          </CardContent>
        </Card>
      )}

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">{format(cursor, 'MMMM yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {(eventsLoading || tasksLoading) && (
              <div className="mb-3 text-sm text-muted-foreground">Loading calendar…</div>
            )}

            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="px-1 text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}

              {monthDays.map((day) => {
                const key = format(day, 'yyyy-MM-dd')
                const dayEvents = eventsByDay.get(key) ?? []
                const dayDeadlines = deadlinesByDay.get(key) ?? []
                const isToday = isSameDay(day, new Date())
                const inMonth = isSameMonth(day, cursor)
                const selected = selectedDay ? isSameDay(day, selectedDay) : false

                return (
                    <DroppableDay
                    key={key}
                    id={key}
                    className={cn(
                      'rounded-2xl border p-2 transition-colors',
                      !inMonth && 'opacity-50',
                      selected && 'border-primary bg-primary/10',
                      !selected && isToday && 'bg-primary/5'
                    )}
                  >
                    <button type="button" onClick={() => setSelectedDay(day)} className="flex w-full items-center justify-between">
                      <span className="text-xs font-semibold">{format(day, 'd')}</span>
                      {dayDeadlines.length + dayEvents.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {dayDeadlines.length + dayEvents.length}
                        </span>
                      )}
                    </button>

                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <DraggableItem key={ev.id} id={`event:${ev.id}`}>
                          <EventPill event={ev} />
                        </DraggableItem>
                      ))}
                      {dayDeadlines.slice(0, 2).map((t) => (
                        <DraggableItem key={t.id} id={`task:${t.id}`}>
                          <DeadlinePill task={t} />
                        </DraggableItem>
                      ))}
                      {dayEvents.length + dayDeadlines.length > 4 && (
                        <div className="text-[10px] text-muted-foreground">+ more</div>
                      )}
                    </div>
                  </DroppableDay>
                )
              })}
            </div>

            {!eventsLoading && !tasksLoading && events.length === 0 && tasks.filter((t) => t.deadline).length === 0 && (
              <EmptyState title="No events or deadlines yet" description="Add an event or set task deadlines to populate the calendar." />
            )}
          </CardContent>
        </Card>
      </DndContext>
    </>
  )
}

