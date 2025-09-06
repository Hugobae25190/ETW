'use client'

import { useState } from 'react'
import { 
  Home, 
  Dumbbell, 
  Briefcase, 
  Brain, 
  MessageSquare, 
  User, 
  Settings, 
  Trophy, 
  Target,
  Users,
  Calendar,
  BookOpen,
  Crown,
  Shield,
  Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const campuses = [
  { id: 'home', name: 'Home', icon: Home, color: 'text-primary' },
  { id: 'sport', name: 'Sport & Nutrition', icon: Dumbbell, color: 'text-chart-2' },
  { id: 'business', name: 'Business', icon: Briefcase, color: 'text-chart-3' },
  { id: 'behavior', name: 'Behavior & Mindset', icon: Brain, color: 'text-chart-4' },
  { id: 'talking', name: 'Talking & Networking', icon: MessageSquare, color: 'text-chart-5' }
]

const homeNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Missions', href: '/missions', icon: Target },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Courses', href: '/courses', icon: BookOpen }
]

const userNavItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings }
]

interface AppSidebarProps {
  user?: {
    id: string
    username: string
    avatar_url?: string
    role: string
    level: string
    strength_points: number
    coins: number
    login_streak: number
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [selectedCampus, setSelectedCampus] = useState('home')
  const pathname = usePathname()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3 text-primary" />
      case 'mentor': return <Shield className="h-3 w-3 text-purple-400" />
      case 'captain': return <Zap className="h-3 w-3 text-red-400" />
      case 'disciplined': return <Target className="h-3 w-3 text-yellow-400" />
      default: return null
    }
  }

  const getLevelEmoji = (level: string) => {
    switch (level) {
      case 'nobody': return '🧢'
      case 'learner': return '🎓'
      case 'soldier': return '🪖'
      case 'gentlemen': return '🎩'
      case 'b-force': return '👑'
      default: return '🧢'
    }
  }

  return (
    <div className="flex h-screen">
      {/* Compact Sidebar */}
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-3 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
        </div>
        
        <div className="flex-1 py-4">
          <div className="space-y-2 px-2">
            {campuses.map((campus) => {
              const Icon = campus.icon
              const isActive = selectedCampus === campus.id
              return (
                <Button
                  key={campus.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="w-12 h-12 p-0"
                  onClick={() => setSelectedCampus(campus.id)}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : campus.color}`} />
                </Button>
              )
            })}
          </div>
        </div>

        <div className="p-2 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" className="w-12 h-12 p-0" asChild>
            <Link href="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </Button>
        </div>
      </div>

      {/* Extended Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getLevelEmoji(user?.level || 'nobody')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sidebar-foreground truncate">
                  {campuses.find(c => c.id === selectedCampus)?.name || 'Home'}
                </h2>
                {user && getRoleIcon(user.role)}
              </div>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.level || 'nobody'} • {user?.login_streak || 0} day streak
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* User Stats */}
            {user && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">Strength</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.strength_points} SP
                  </Badge>
                </div>
                <Progress value={(user.strength_points % 1000) / 10} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">Coins</span>
                  <Badge variant="outline" className="text-xs">
                    {user.coins}
                  </Badge>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                Navigation
              </h3>
              {homeNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start h-9"
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                Today
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sidebar-foreground/70">Tasks</span>
                  <span className="text-sidebar-foreground">2/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sidebar-foreground/70">Online</span>
                  <Badge variant="secondary" className="text-xs">247</Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          {userNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start h-9"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
