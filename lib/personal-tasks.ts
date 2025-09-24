'use client'

export type PersonalTask = {
  id: string
  title: string
  description: string
  reward: { sp: number; coins: number }
  isCompleted: boolean
  type: 'personal'
  dueDate?: string
  progress?: number
  target?: number
  scheduledStart?: string | null
  scheduledEnd?: string | null
  category?: 'Marketing' | 'Sales' | 'Finances' | 'Other'
  status?: 'todo' | 'in_progress' | 'done'
  isMultiDay?: boolean
  completedAt?: string | null
}

const STORAGE_KEY = 'etw-personal-tasks'

export function loadPersonalTasks(): PersonalTask[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as PersonalTask[]
    return []
  } catch {
    return []
  }
}

export function savePersonalTasks(tasks: PersonalTask[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function upsertPersonalTask(task: PersonalTask): PersonalTask[] {
  const tasks = loadPersonalTasks()
  const idx = tasks.findIndex(t => t.id === task.id)
  if (idx >= 0) tasks[idx] = task
  else tasks.push(task)
  savePersonalTasks(tasks)
  return tasks
}

export function removePersonalTask(taskId: string): PersonalTask[] {
  const tasks = loadPersonalTasks().filter(t => t.id !== taskId)
  savePersonalTasks(tasks)
  return tasks
}

export function togglePersonalTaskCompleted(taskId: string): PersonalTask[] {
  const tasks = loadPersonalTasks().map(t => {
    if (t.id !== taskId) return t
    const nowIso = new Date().toISOString()
    return { ...t, isCompleted: !t.isCompleted, completedAt: !t.isCompleted ? nowIso : null }
  })
  savePersonalTasks(tasks)
  return tasks
}

export function schedulePersonalTask(taskId: string, startISO: string, endISO: string): PersonalTask[] {
  const tasks = loadPersonalTasks().map(t => t.id === taskId ? { ...t, scheduledStart: startISO, scheduledEnd: endISO } : t)
  savePersonalTasks(tasks)
  return tasks
}

export function updatePersonalTask(taskId: string, patch: Partial<PersonalTask>): PersonalTask[] {
  const tasks = loadPersonalTasks().map(t => t.id === taskId ? { ...t, ...patch } : t)
  savePersonalTasks(tasks)
  return tasks
}


