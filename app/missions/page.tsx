'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AppSidebar } from '@/components/etw/app-sidebar'
import TaskEditor from '@/components/etw/task-editor'
import { Sidebar } from '@/components/etw/sidebar'
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Target, 
  Calendar, 
  Clock, 
  Trophy,
  Star,
  User,
  Flame
} from 'lucide-react'
import { loadPersonalTasks, upsertPersonalTask, schedulePersonalTask, updatePersonalTask, PersonalTask } from '@/lib/personal-tasks'

interface Task {
  id: string
  title: string
  description: string
  reward: {
    sp: number
    coins: number
  }
  isCompleted: boolean
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'personal'
  dueDate?: string
  progress?: number
  target?: number
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Morning Workout',
    description: '45 minutes strength training - focus on compound movements',
    reward: { sp: 25, coins: 5 },
    isCompleted: true,
    type: 'daily'
  },
  {
    id: '2',
    title: 'Read 30 Pages',
    description: 'Business or self-development book - currently reading "Atomic Habits"',
    reward: { sp: 15, coins: 3 },
    isCompleted: false,
    type: 'daily',
    dueDate: 'Due today'
  },
  {
    id: '3',
    title: 'Cold Outreach',
    description: 'Send 10 business emails to potential clients',
    reward: { sp: 20, coins: 4 },
    isCompleted: false,
    type: 'daily',
    dueDate: 'Due today'
  },
  {
    id: '4',
    title: 'Complete 5 Workouts',
    description: 'Maintain consistent training schedule throughout the week',
    reward: { sp: 100, coins: 20 },
    isCompleted: false,
    type: 'weekly',
    progress: 3,
    target: 5,
    dueDate: 'Due in 3 days'
  },
  {
    id: '5',
    title: 'Weekly Business Review',
    description: 'Analyze metrics, plan next week, review goals',
    reward: { sp: 75, coins: 15 },
    isCompleted: false,
    type: 'weekly',
    dueDate: 'Due Sunday'
  },
  {
    id: '6',
    title: 'Monthly Strength Assessment',
    description: 'Test max lifts: bench, squat, deadlift',
    reward: { sp: 200, coins: 50 },
    isCompleted: false,
    type: 'monthly',
    dueDate: 'Due in 12 days'
  },
  {
    id: '7',
    title: 'Reach 100kg Bench Press',
    description: 'Current: 85kg. Increase bench press to 100kg by end of year',
    reward: { sp: 1000, coins: 200 },
    isCompleted: false,
    type: 'yearly',
    progress: 85,
    target: 100,
    dueDate: 'Dec 31, 2025'
  },
  {
    id: '8',
    title: 'Build $10K/Month Business',
    description: 'Scale current business to consistent $10K monthly revenue',
    reward: { sp: 2000, coins: 500 },
    isCompleted: false,
    type: 'yearly',
    progress: 3500,
    target: 10000,
    dueDate: 'Dec 31, 2025'
  },
  {
    id: '9',
    title: 'Complete 365-Day Streak',
    description: 'Maintain daily task completion for entire year',
    reward: { sp: 3650, coins: 1000 },
    isCompleted: false,
    type: 'yearly',
    progress: 23,
    target: 365,
    dueDate: 'Dec 31, 2025'
  },
  // removed demo personal task to keep list clean
]

const mockUser = {
  id: '1',
  username: 'Hugo',
  avatar_url: '',
  role: 'admin',
  level: 'b-force',
  strength_points: 2847,
  coins: 1250,
  login_streak: 23
}

// old import removed after unifying with shared store at top

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorTaskId, setEditorTaskId] = useState<string | undefined>(undefined)

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task))
    // reflect to shared store so Calendar updates too (with completedAt timestamp)
    const p = loadPersonalTasks().find(p => p.id === taskId)
    if (p) {
      const nowIso = new Date().toISOString()
      const next = updatePersonalTask(taskId, { isCompleted: !p.isCompleted, completedAt: !p.isCompleted ? nowIso : null })
      window.dispatchEvent(new CustomEvent('personal-tasks-updated'))
    }
  }

  const addPersonalTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: PersonalTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        reward: { sp: 50, coins: 10 },
        isCompleted: false,
        type: 'personal',
        dueDate: 'Self-paced',
        scheduledStart: null,
        scheduledEnd: null,
      }
      const personals = upsertPersonalTask(newTask)
      // reflect into local UI list for missions
      setTasks(prev => [...prev, {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        reward: newTask.reward,
        isCompleted: newTask.isCompleted,
        type: 'personal',
        dueDate: newTask.dueDate,
      }])
      setNewTaskTitle('')
      setNewTaskDescription('')
      setIsAddingTask(false)
    }
  }

  // On mount, hydrate personal tasks from storage and merge into state if any not present
  const syncFromStore = () => {
    const stored = loadPersonalTasks()
    setTasks(prev => {
      const nonPersonal = prev.filter(t => t.type !== 'personal')
      const formatDate = (d: Date) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const personals: Task[] = stored.map(p => {
        let dueLabel = 'No date'
        if (p.scheduledStart) {
          const start = new Date(p.scheduledStart)
          const end = p.scheduledEnd ? new Date(p.scheduledEnd) : undefined
          // Multi-day range
          if (p.isMultiDay && end) {
            dueLabel = `${formatDate(start)} - ${formatDate(end)}`
          } else {
            const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
            const dayDiff = Math.floor((startDay.getTime() - todayStart.getTime()) / (1000*60*60*24))
            const now = new Date()
            if (dayDiff === 0) {
              // today: show precise countdown
              const diffMs = start.getTime() - now.getTime()
              if (diffMs >= 0) {
                const totalMin = Math.max(0, Math.round(diffMs / 60000))
                const h = Math.floor(totalMin / 60)
                const m = totalMin % 60
                const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                dueLabel = `Today • in ${h>0?`${h}h `:''}${m}m (at ${timeStr})`
              } else {
                const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                dueLabel = `Today • at ${timeStr}`
              }
            } else if (dayDiff > 0 && dayDiff <= 7) {
              dueLabel = `Due in ${dayDiff} day${dayDiff>1?'s':''}`
            } else if (dayDiff < 0 && Math.abs(dayDiff) <= 7) {
              dueLabel = `${Math.abs(dayDiff)} day${Math.abs(dayDiff)>1?'s':''} ago`
            } else {
              dueLabel = formatDate(start)
            }
          }
        }
        return {
          id: p.id,
          title: p.title,
          description: p.description || '',
          reward: p.reward,
          isCompleted: p.isCompleted,
          type: 'personal',
          dueDate: dueLabel,
        }
      })
      return [...nonPersonal, ...personals]
    })
  }

  useEffect(() => {
    syncFromStore()
  }, [])

  useEffect(() => {
    const handler = () => syncFromStore()
    window.addEventListener('personal-tasks-updated', handler)
    return () => window.removeEventListener('personal-tasks-updated', handler)
  }, [])

  const getTasksByType = (type: Task['type']) => tasks.filter(task => task.type === type)

  const getStats = (type: Task['type']) => {
    const typeTasks = getTasksByType(type)
    const completed = typeTasks.filter(task => task.isCompleted).length
    const total = typeTasks.length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
      if (task.type === 'personal') {
        setEditorTaskId(task.id)
        setEditorOpen(true)
      }
    }}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); toggleTask(task.id) }}
            className="mt-1 p-0 h-auto"
          >
            {task.isCompleted ? (
              <CheckCircle className="h-7 w-7 text-green-500" />
            ) : (
              <Circle className="h-7 w-7 text-muted-foreground" />
            )}
          </Button>
          
          <div className="flex-1 space-y-2" onClick={() => {
            if (task.type === 'personal') {
              const p = loadPersonalTasks().find(p => p.id === task.id)
              if (p) {
                window.dispatchEvent(new CustomEvent('open-calendar-task-editor', { detail: { taskId: task.id } }))
              }
            }
          }}>
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              {task.isCompleted && (
                <Badge variant="default" className="text-xs">
                  Completed
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">{task.description}</p>
            {task.type === 'personal' && (
              <div className="text-xs text-muted-foreground">Date: {task.dueDate}</div>
            )}
            
            {task.progress !== undefined && task.target !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{task.progress}/{task.target}</span>
                </div>
                <Progress value={(task.progress / task.target) * 100} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-primary" />
                  +{task.reward.sp} SP
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  +{task.reward.coins} coins
                </span>
              </div>
              
              {task.dueDate && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.dueDate}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const dailyStats = getStats('daily')
  const weeklyStats = getStats('weekly')
  const monthlyStats = getStats('monthly')
  const yearlyStats = getStats('yearly')
  const personalStats = getStats('personal')

  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBARS AJOUTÉES */}
      <AppSidebar user={mockUser} />
      <Sidebar user={mockUser} />
      
      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Missions</h1>
            <p className="text-muted-foreground">
              Complete your daily, weekly, and monthly challenges
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">{dailyStats.completed}/{dailyStats.total}</div>
                <div className="text-xs text-muted-foreground">Daily Progress</div>
                <div className="text-xs text-primary">{dailyStats.percentage}% complete</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{weeklyStats.completed + weeklyStats.total}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
                <div className="text-xs text-green-500">{tasks.filter(t => t.isCompleted).length} completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-xs text-muted-foreground">Streak</div>
                <div className="text-xs text-primary">days in a row</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">#3</div>
                <div className="text-xs text-muted-foreground">Team Rank</div>
                <div className="text-xs text-primary">in your team</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{yearlyStats.completed}/{yearlyStats.total}</div>
                <div className="text-xs text-muted-foreground">Yearly Goals</div>
                <div className="text-xs text-primary">in progress</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal ({personalStats.total - personalStats.completed})
              </TabsTrigger>
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Daily ({dailyStats.total - dailyStats.completed})
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weekly ({weeklyStats.total - weeklyStats.completed})
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Monthly ({monthlyStats.total - monthlyStats.completed})
              </TabsTrigger>
              <TabsTrigger value="yearly" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Yearly ({yearlyStats.total - yearlyStats.completed})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Daily Tasks</h2>
                <Badge variant="secondary">Reset in 7h 42m</Badge>
              </div>
              <div className="space-y-4">
                {getTasksByType('daily').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Weekly Tasks</h2>
                <Badge variant="secondary">Reset in 3 days</Badge>
              </div>
              <div className="space-y-4">
                {getTasksByType('weekly').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Monthly Tasks</h2>
                <Badge variant="secondary">Reset in 12 days</Badge>
              </div>
              <div className="space-y-4">
                {getTasksByType('monthly').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="yearly" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Yearly Goals</h2>
                <Badge variant="secondary">2025 Goals</Badge>
              </div>
              <div className="space-y-4">
                {getTasksByType('yearly').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Personal Tasks</h2>
                <Button size="sm" onClick={() => { setEditorTaskId(undefined); setEditorOpen(true) }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-4">
                {getTasksByType('personal').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <TaskEditor open={editorOpen} taskId={editorTaskId} onClose={() => { setEditorOpen(false); setEditorTaskId(undefined); syncFromStore() }} />
    </div>
  )
}