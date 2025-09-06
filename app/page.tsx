'use client'

import { useState, useEffect } from 'react'
import { AppSidebar } from '@/components/etw/app-sidebar'
import { FloatingChat } from '@/components/etw/floating-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Target, 
  Trophy, 
  Users, 
  Zap, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Crown
} from 'lucide-react'

// Mock user data - will be replaced with Supabase
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

const mockTasks = [
  {
    id: '1',
    title: 'Complete Morning Workout',
    description: '45 minutes strength training',
    type: 'daily',
    status: 'completed',
    strength_reward: 25,
    coins_reward: 5
  },
  {
    id: '2',
    title: 'Read 30 Pages',
    description: 'Business or self-development book',
    type: 'daily',
    status: 'pending',
    strength_reward: 15,
    coins_reward: 3
  },
  {
    id: '3',
    title: 'Cold Outreach',
    description: 'Send 10 business emails',
    type: 'daily',
    status: 'pending',
    strength_reward: 20,
    coins_reward: 4
  }
]

const mockLeaderboard = [
  { rank: 1, username: 'Alpha_Wolf', points: 3247, streak: 45 },
  { rank: 2, username: 'IronMind', points: 3156, streak: 32 },
  { rank: 3, username: 'Hugo', points: 2847, streak: 23 },
  { rank: 4, username: 'Warrior_23', points: 2654, streak: 18 },
  { rank: 5, username: 'Phoenix_Rise', points: 2543, streak: 27 }
]

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [completedTasks, setCompletedTasks] = useState(1)

  const completionRate = (completedTasks / mockTasks.length) * 100

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={mockUser} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {mockUser.username}! 👑
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to escape the weakness today?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                {mockUser.login_streak} day streak
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                {mockUser.level}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Strength Points</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUser.strength_points}</div>
                <p className="text-xs text-muted-foreground">
                  +47 from yesterday
                </p>
                <Progress value={(mockUser.strength_points % 1000) / 10} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coins</CardTitle>
                <Target className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUser.coins}</div>
                <p className="text-xs text-muted-foreground">
                  +12 from tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Progress</CardTitle>
                <CheckCircle className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}/{mockTasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completionRate.toFixed(0)}% complete
                </p>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
                <Trophy className="h-4 w-4 text-chart-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#3</div>
                <p className="text-xs text-muted-foreground">
                  Top 5% this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Tasks */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      task.status === 'completed' 
                        ? 'bg-chart-2/10 border-chart-2/20' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        task.status === 'completed' 
                          ? 'bg-chart-2 text-white' 
                          : 'bg-muted'
                      }`}>
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        +{task.strength_reward} SP
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        +{task.coins_reward} coins
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      user.username === mockUser.username 
                        ? 'bg-primary/10 border border-primary/20' 
                        : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? 'bg-chart-3 text-white' :
                      user.rank === 2 ? 'bg-muted-foreground text-white' :
                      user.rank === 3 ? 'bg-chart-5 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.points} SP</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.streak}d
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Join Team
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Event
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FloatingChat/>
    </div>
  )
}
