'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, X } from 'lucide-react'
import { PersonalTask, loadPersonalTasks, upsertPersonalTask, schedulePersonalTask, updatePersonalTask, removePersonalTask } from '@/lib/personal-tasks'

interface TaskEditorProps {
  open: boolean
  taskId?: string
  onClose: () => void
}

export default function TaskEditor({ open, taskId, onClose }: TaskEditorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [isMultiDay, setIsMultiDay] = useState(false)

  useEffect(() => {
    if (!open) return
    if (taskId) {
      const t = loadPersonalTasks().find(t => t.id === taskId)
      if (t) {
        setTitle(t.title)
        setDescription(t.description || '')
        const s = t.scheduledStart ? new Date(t.scheduledStart) : new Date()
        const e = t.scheduledEnd ? new Date(t.scheduledEnd) : new Date(s.getTime()+60*60*1000)
        setDate(s.toISOString().slice(0,10))
        setStartTime(s.toTimeString().slice(0,5))
        setEndTime(e.toTimeString().slice(0,5))
        setIsMultiDay(t.isMultiDay || false)
      }
    } else {
      const now = new Date(); const d = now.toISOString().slice(0,10)
      const st = now.toTimeString().slice(0,5)
      const et = new Date(now.getTime()+60*60*1000).toTimeString().slice(0,5)
      setTitle('')
      setDescription('')
      setDate(d)
      setStartTime(st)
      setEndTime(et)
      setIsMultiDay(false)
    }
  }, [open, taskId])

  const handleSave = () => {
    const day = new Date(date)
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const start = new Date(day); start.setHours(sh, sm, 0, 0)
    const end = new Date(day); end.setHours(eh, em, 0, 0)
    if (!taskId) {
      const t: PersonalTask = {
        id: Date.now().toString(),
        title,
        description,
        reward: { sp: 50, coins: 10 },
        isCompleted: false,
        type: 'personal',
        dueDate: 'Self-paced',
        scheduledStart: start.toISOString(),
        scheduledEnd: end.toISOString(),
        isMultiDay,
      }
      upsertPersonalTask(t)
    } else {
      schedulePersonalTask(taskId, start.toISOString(), end.toISOString())
      updatePersonalTask(taskId, { title, description, isMultiDay })
    }
    // notify listeners and close
    window.dispatchEvent(new CustomEvent('personal-tasks-updated'))
    onClose()
  }

  const handleDelete = () => {
    if (taskId) {
      removePersonalTask(taskId)
      window.dispatchEvent(new CustomEvent('personal-tasks-updated'))
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl" showCloseButton={false}>
        <DialogHeader className="pb-6 relative">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{taskId ? 'Edit task' : 'Create task'}</DialogTitle>
            <div className="flex items-center gap-2">
              {taskId && (
                <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">Title</Label>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter task title" className="border-0 bg-transparent text-lg font-medium h-12 px-0 placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="multiday" checked={isMultiDay} onCheckedChange={(c)=>setIsMultiDay(!!c)} />
            <Label htmlFor="multiday" className="text-base font-medium text-foreground">Multi-day task</Label>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">{isMultiDay ? 'Start date' : 'Date'}</Label>
              <div className="border-2 border-border rounded-lg p-4 bg-background">
                <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border-0 bg-transparent text-lg font-medium h-12 px-0" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Time</Label>
              <div className="border-2 border-border rounded-lg p-4 bg-background flex items-center gap-2">
                <Input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="border-0 bg-transparent text-lg font-medium h-12 px-0 flex-1" />
                <span className="text-lg font-medium">-</span>
                <Input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)} className="border-0 bg-transparent text-lg font-medium h-12 px-0 flex-1" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">Description</Label>
            <div className="border-2 border-border rounded-lg p-4 bg-background">
              <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Describe the task..." className="border-0 bg-transparent text-base min-h-[120px] px-0 resize-none placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="px-8">Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


