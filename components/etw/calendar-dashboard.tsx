"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Clock, CheckCircle2, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react'
import { PersonalTask, loadPersonalTasks, upsertPersonalTask, removePersonalTask, togglePersonalTaskCompleted, schedulePersonalTask, updatePersonalTask } from '@/lib/personal-tasks'

export default function CalendarDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tasks, setTasks] = useState<PersonalTask[]>([])
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  useEffect(() => {
    setTasks(loadPersonalTasks())
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Allow Missions page to open this editor via window event
  useEffect(() => {
    const handler = (e: any) => {
      const id = e?.detail?.taskId as string | undefined
      if (!id) return
      const p = loadPersonalTasks().find(t => t.id === id)
      if (!p) return
      openTaskForEdit(p)
    }
    const refresh = () => setTasks(loadPersonalTasks())
    window.addEventListener('open-calendar-task-editor', handler as any)
    window.addEventListener('personal-tasks-updated', refresh)
    return () => {
      window.removeEventListener('open-calendar-task-editor', handler as any)
      window.removeEventListener('personal-tasks-updated', refresh)
    }
  }, [])

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const navigateDate = (dir: 'prev' | 'next') => { const d = new Date(currentDate); d.setDate(d.getDate() + (dir === 'next' ? 1 : -1)); setCurrentDate(d) }

  const hours = useMemo(() => Array.from({ length: 23 }, (_, i) => i + 1), [])
  const tasksForSelectedDay = useMemo(() => {
    const start = new Date(currentDate); start.setHours(0,0,0,0)
    const end = new Date(start); end.setDate(end.getDate()+1)
    const now = new Date()
    const cutoff = new Date(start)
    cutoff.setDate(cutoff.getDate()+1)
    cutoff.setHours(2,0,0,0) // 2am next day
    return tasks.filter(t => {
      const inDay = t.scheduledStart && new Date(t.scheduledStart) >= start && new Date(t.scheduledStart) < end
      if (!inDay) return false
      if (!t.isCompleted) return true
      if (!t.completedAt) return true
      const completedAt = new Date(t.completedAt)
      // keep visible until 2am next day
      return completedAt < cutoff
    })
  }, [tasks, currentDate])

  // Soft color palette per task
  const getTaskColors = (id: string) => {
    const palette = [
      { bg: 'bg-emerald-700/70', border: 'border-emerald-500' },
      { bg: 'bg-blue-700/70', border: 'border-blue-500' },
      { bg: 'bg-red-700/70', border: 'border-red-500' },
      { bg: 'bg-slate-700/70', border: 'border-slate-500' },
    ]
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
    const c = palette[hash % palette.length]
    return c
  }

  // Compute side-by-side layout for overlapping tasks
  type Layout = { top: number; height: number; leftPct: number; widthPct: number }
  const layoutById: Record<string, Layout> = useMemo(() => {
    const minutes = (d: Date) => d.getHours() * 60 + d.getMinutes()
    const items = tasksForSelectedDay.map(t => {
      const s = t.scheduledStart ? new Date(t.scheduledStart) : new Date()
      const e = t.scheduledEnd ? new Date(t.scheduledEnd) : new Date(s.getTime()+60*60*1000)
      return { id: t.id, start: minutes(s), end: minutes(e) }
    })
    // Build groups of overlapping tasks (connected components)
    const n = items.length
    const adj: number[][] = Array.from({ length: n }, () => [])
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = items[i], b = items[j]
        if (a.start < b.end && a.end > b.start) {
          adj[i].push(j); adj[j].push(i)
        }
      }
    }
    const visited = new Array(n).fill(false)
    const groups: number[][] = []
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        const stack = [i]; visited[i] = true; const comp: number[] = []
        while (stack.length) {
          const v = stack.pop() as number; comp.push(v)
          for (const w of adj[v]) if (!visited[w]) { visited[w] = true; stack.push(w) }
        }
        groups.push(comp)
      }
    }
    const layout: Record<string, Layout> = {}
    // For each group, assign columns greedily (like calendar)
    for (const comp of groups) {
      const seq = comp.map(i => items[i]).sort((a,b) => a.start - b.start || a.end - b.end)
      const columnEnd: number[] = [] // end time for each column
      const colIndexById = new Map<string, number>()
      for (const it of seq) {
        let placed = false
        for (let c = 0; c < columnEnd.length; c++) {
          if (it.start >= columnEnd[c]) { colIndexById.set(it.id, c); columnEnd[c] = it.end; placed = true; break }
        }
        if (!placed) { colIndexById.set(it.id, columnEnd.length); columnEnd.push(it.end) }
      }
      const numCols = columnEnd.length
      for (const it of seq) {
        const col = colIndexById.get(it.id) || 0
        const leftPct = (col / numCols) * 100
        const widthPct = 100 / numCols
        const top = ((it.start - 60) / 60) * 60
        const height = Math.max(30, ((it.end - it.start) / 60) * 60)
        layout[it.id] = { top, height, leftPct, widthPct }
      }
    }
    return layout
  }, [tasksForSelectedDay])

  // Drag/resize removed per request; simple click to open editor.

  const getCurrentDateTime = () => { const now = new Date(); const date = now.toISOString().split('T')[0]; const time = now.toTimeString().slice(0,5); const endTime = new Date(now.getTime()+60*60*1000).toTimeString().slice(0,5); return { date, time, endTime } }
  const [draft, setDraft] = useState(() => { const { date, time, endTime } = getCurrentDateTime(); return { title: '', description: '', date, startTime: time, endTime, isMultiDay: false } })
  const resetDraft = () => { const { date, time, endTime } = getCurrentDateTime(); setDraft({ title:'', description:'', date, startTime: time, endTime, isMultiDay:false }) }

  const addTask = () => {
    if (!draft.title.trim()) return
    const day = new Date(draft.date)
    const [sh, sm] = draft.startTime.split(':').map(Number)
    const [eh, em] = draft.endTime.split(':').map(Number)
    const start = new Date(day); start.setHours(sh, sm, 0, 0)
    const end = new Date(day); end.setHours(eh, em, 0, 0)
    const newTask: PersonalTask = {
      id: Date.now().toString(),
      title: draft.title,
      description: draft.description,
      reward: { sp: 50, coins: 10 },
      isCompleted: false,
      type: 'personal',
      dueDate: 'Self-paced',
      scheduledStart: start.toISOString(),
      scheduledEnd: end.toISOString(),
      isMultiDay: draft.isMultiDay,
    }
    const next = upsertPersonalTask(newTask)
    setTasks(next)
    resetDraft()
    setIsAddTaskOpen(false)
  }

  const openTaskForEdit = (task: PersonalTask) => {
    setSelectedTask(task)
    const s = task.scheduledStart ? new Date(task.scheduledStart) : new Date()
    const e = task.scheduledEnd ? new Date(task.scheduledEnd) : new Date(s.getTime()+60*60*1000)
    setDraft({
      title: task.title,
      description: task.description || '',
      date: s.toISOString().slice(0,10),
      startTime: s.toTimeString().slice(0,5),
      endTime: e.toTimeString().slice(0,5),
      isMultiDay: task.isMultiDay || false,
    })
    setIsEditMode(true)
  }

  const updateTask = () => {
    if (!selectedTask) return
    const day = new Date(draft.date)
    const [sh, sm] = draft.startTime.split(':').map(Number)
    const [eh, em] = draft.endTime.split(':').map(Number)
    const start = new Date(day); start.setHours(sh, sm, 0, 0)
    const end = new Date(day); end.setHours(eh, em, 0, 0)
    schedulePersonalTask(selectedTask.id, start.toISOString(), end.toISOString())
    const next = updatePersonalTask(selectedTask.id, { title: draft.title, description: draft.description, isMultiDay: draft.isMultiDay })
    setTasks(next)
    setSelectedTask(null)
    setIsEditMode(false)
  }

  const toggleTask = (id: string) => {
    setTasks(togglePersonalTaskCompleted(id))
    // ensure external pages refresh
    window.dispatchEvent(new CustomEvent('personal-tasks-updated'))
  }
  const confirmDeleteTask = (id: string) => { setTaskToDelete(id); setShowDeleteConfirm(true) }
  const deleteTask = () => { if(taskToDelete){ setTasks(removePersonalTask(taskToDelete)); setShowDeleteConfirm(false); setTaskToDelete(null); setSelectedTask(null); setIsEditMode(false) } }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="flex items/items-center gap-2">
                    <ChevronLeft className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => navigateDate('prev')} />
                    Daily Schedule
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatDate(currentDate)}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => navigateDate('next')} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-mono bg-muted px-3 py-1 rounded">{formatTime(currentTime)}</div>
                  <Dialog open={isAddTaskOpen} onOpenChange={(open)=>{setIsAddTaskOpen(open); if(open) resetDraft()}}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Task</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader className="pb-6"><DialogTitle className="text-2xl font-bold">Create task</DialogTitle></DialogHeader>
                      <div className="space-y-8">
                        <div className="space-y-3"><Label className="text-base font-semibold text-foreground">Title</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Input value={draft.title} onChange={(e)=>setDraft({...draft, title:e.target.value})} placeholder="Enter task title" className="border-0 bg-transparent text-lg font-medium h-12 px-0 placeholder:text-muted-foreground" /></div></div>
                        <div className="flex items-center space-x-2"><Checkbox id="multiday" checked={draft.isMultiDay} onCheckedChange={(c)=>setDraft({...draft, isMultiDay: !!c})} /><Label htmlFor="multiday" className="text-base font-medium text-foreground">Multi-day task</Label></div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3"><Label className="text-base font-semibold text-foreground">{draft.isMultiDay ? 'Start date' : 'Date'}</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Input type="date" value={draft.date} onChange={(e)=>setDraft({...draft, date:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0" /></div></div>
                          {draft.isMultiDay ? (
                            <div className="space-y-3"><Label className="text-base font-semibold text-foreground">End date</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Input type="date" disabled value={draft.date} className="border-0 bg-transparent text-lg font-medium h-12 px-0" /></div></div>
                          ) : (
                            <div className="space-y-3"><Label className="text-base font-semibold text-foreground">Time</Label><div className="border-2 border-border rounded-lg p-4 bg-background flex items-center gap-2"><Input type="time" value={draft.startTime} onChange={(e)=>setDraft({...draft, startTime:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0 flex-1" /><span className="text-lg font-medium">-</span><Input type="time" value={draft.endTime} onChange={(e)=>setDraft({...draft, endTime:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0 flex-1" /></div></div>
                          )}
                        </div>
                        <div className="space-y-3"><Label className="text-base font-semibold text-foreground">Description</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Textarea value={draft.description} onChange={(e)=>setDraft({...draft, description:e.target.value})} placeholder="Describe the task..." className="border-0 bg-transparent text-base min-h-[120px] px-0 resize-none placeholder:text-muted-foreground" /></div></div>
                        <div className="flex justify-end gap-4 pt-4"><Button variant="outline" onClick={()=>setIsAddTaskOpen(false)}>Cancel</Button><Button onClick={addTask} className="px-8">Create task</Button></div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted/5 rounded-lg border overflow-y-auto" style={{ height: '500px' }}>
                <div className="relative pl-12" style={{ height: '1380px' }}>
                  {hours.map((hour, i) => (
                    <div key={hour}>
                      <div className="absolute left-0 w-10 text-right text-sm font-bold text-foreground pr-2" style={{ top: `${i*60+20}px` }}>{String(hour).padStart(2,'0')}</div>
                      <div className="absolute left-12 right-0 border-t-2 border-border/40" style={{ top: `${i*60}px` }} />
                    </div>
                  ))}
                  {Array.from({ length: 5 }, (_, i) => (<div key={i} className="absolute top-0 bottom-0 border-l border-border/30" style={{ left: `${12 + (i*20)}%` }} />))}
                  {tasksForSelectedDay.map(task => {
                    if (task.isMultiDay) {
                      const c = getTaskColors(task.id)
                      return (
                        <div key={task.id} className={`absolute ${c.bg} text-white rounded border ${c.border} cursor-pointer hover:opacity-90 transition-opacity p-2 text-xs font-medium z-10 ml-12`} style={{ top:'20px', height:'40px', left:'0%', width:'100%', marginLeft:'48px' }} onClick={()=>openTaskForEdit(task)}>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-current rounded-full opacity-70" /><span className="font-semibold truncate">{task.title}</span>{task.isCompleted && <CheckCircle2 className="h-3 w-3 ml-auto" />}</div>
                          <div className="text-xs opacity-60 mt-1">Multi-day</div>
                        </div>
                      )
                    }
                    const s = task.scheduledStart ? new Date(task.scheduledStart) : new Date()
                    const e = task.scheduledEnd ? new Date(task.scheduledEnd) : new Date(s.getTime()+60*60*1000)
                    const lay = layoutById[task.id] || { top: 0, height: 30, leftPct: 0, widthPct: 100 }
                    const c = getTaskColors(task.id)
                    const topPx = lay.top
                    const heightPx = lay.height
                    return (
                      <div key={task.id} className={`absolute ${c.bg} text-white rounded border ${c.border} hover:opacity-90 transition-opacity text-xs font-medium z-10 group`} style={{ top: `${topPx}px`, height: `${heightPx}px`, left: `calc(${lay.leftPct}% + 48px)`, width: `${lay.widthPct}%` }} onClick={()=>openTaskForEdit(task)}>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-current rounded-full opacity-70" /><span className="font-semibold truncate">{task.title}</span>{task.isCompleted && <CheckCircle2 className="h-3 w-3 ml-auto" />}</div>
                        <div className="text-xs opacity-60 mt-1">{s.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {e.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                      </div>
                    )
                  })}
                  {currentDate.toDateString()===new Date().toDateString() && (
                    <div className="absolute left-12 right-0 h-0.5 bg-red-500 z-20" style={{ top: `${((currentTime.getHours()*60+currentTime.getMinutes()-60)/60)*60}px` }}>
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Today's Tasks</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksForSelectedDay.length===0 ? (<p className="text-muted-foreground text-sm">No tasks for this day</p>) : tasksForSelectedDay.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <button onClick={()=>toggleTask(task.id)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted?'bg-green-500 border-green-500':'border-gray-300 hover:border-green-400'}`}>{task.isCompleted && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}</button>
                  <div className="flex-1 cursor-pointer" onClick={()=>openTaskForEdit(task)}>
                    <div className="flex items-center gap-2"><h4 className={`font-medium text-sm ${task.isCompleted?'line-through text-muted-foreground':''}`}>{task.title}</h4></div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1"><Clock className="h-3 w-3" />{task.scheduledStart && task.scheduledEnd ? `${new Date(task.scheduledStart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${new Date(task.scheduledEnd).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : '—'}</div>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditMode} onOpenChange={()=>{setIsEditMode(false); setSelectedTask(null)}}>
        <DialogContent className="max-w-4xl" showCloseButton={false}>
          <DialogHeader className="pb-6 relative">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Edit task</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={()=>selectedTask && confirmDeleteTask(selectedTask.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={()=>{setIsEditMode(false); setSelectedTask(null)}} className="h-8 w-8 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-8">
            <div className="space-y-3"><Label className="text-base font-semibold text-foreground">Title</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Input value={draft.title} onChange={(e)=>setDraft({...draft, title:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0" /></div></div>
            <div className="flex items-center space-x-2"><Checkbox id="multiday-edit" checked={draft.isMultiDay} onCheckedChange={(c)=>setDraft({...draft, isMultiDay: !!c})} /><Label htmlFor="multiday-edit" className="text-base font-medium text-foreground">Multi-day task</Label></div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3"><Label className="text-base font-semibold text-foreground">{draft.isMultiDay?'Start date':'Date'}</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Input type="date" value={draft.date} onChange={(e)=>setDraft({...draft, date:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0" /></div></div>
              {draft.isMultiDay ? (<div className="space-y-3"><Label className="text-base font-semibold text-foreground">End date</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Input type="date" disabled value={draft.date} className="border-0 bg-transparent text-lg font-medium h-12 px-0" /></div></div>) : (
                <div className="space-y-3"><Label className="text-base font-semibold text-foreground">Time</Label><div className="border-2 border-border rounded-lg p-4 bg-background flex items-center gap-2"><Input type="time" value={draft.startTime} onChange={(e)=>setDraft({...draft, startTime:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0 flex-1" /><span className="text-lg font-medium">-</span><Input type="time" value={draft.endTime} onChange={(e)=>setDraft({...draft, endTime:e.target.value})} className="border-0 bg-transparent text-lg font-medium h-12 px-0 flex-1" /></div></div>)}
            </div>
            <div className="space-y-3"><Label className="text-base font-semibold text-foreground">Description</Label><div className="border-2 border-border rounded-lg p-4 bg-background"><Textarea value={draft.description} onChange={(e)=>setDraft({...draft, description:e.target.value})} className="border-0 bg-transparent text-base min-h-[120px] px-0 resize-none" /></div></div>
            <div className="flex justify-end gap-4 pt-4"><Button variant="outline" onClick={()=>{setIsEditMode(false); setSelectedTask(null)}}>Cancel</Button><Button onClick={updateTask} className="px-8">Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


