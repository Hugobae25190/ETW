'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Home, 
  Dumbbell, 
  Briefcase, 
  Target, 
  MessageSquare,
  BarChart3,
  CheckSquare,
  Trophy,
  Users,
  Calendar,
  GraduationCap,
  User,
  Settings,
  Crown,
  Coins,
  Flame
} from 'lucide-react'

const campusIcons = [
  { icon: Home, href: '/', label: 'Home' },
  { icon: Dumbbell, href: '/sport', label: 'Sport' },
  { icon: Briefcase, href: '/business', label: 'Business' },
  { icon: Target, href: '/behavior', label: 'Behavior' },
  { icon: MessageSquare, href: '/talking', label: 'Talking' },
]

const navigationItems = [
  { icon: BarChart3, href: '/dashboard', label: 'Dashboard' },
  { icon: CheckSquare, href: '/tasks', label: 'Daily Tasks' },
  { icon: Trophy, href: '/leaderboard', label: 'Leaderboard' },
  { icon: Users, href: '/teams', label: 'Teams' },
  { icon: Calendar, href: '/calendar', label: 'Calendar' },
  { icon: GraduationCap, href: '/courses', label: 'Courses' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen">
      {/* Compact Campus Sidebar */}
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-4">
        {campusIcons.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "p-3 rounded-lg transition-colors hover:bg-muted",
                isActive && "bg-primary text-primary-foreground"
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </div>

      {/* Extended Navigation Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* User Profile Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  H
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1">
                <Crown className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Hugo</span>
                <Badge variant="secondary" className="text-xs">admin</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>b-force</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  23 day streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Strength</span>
            <span className="text-sm font-bold">2847 SP</span>
          </div>
          <Progress value={75} className="h-2" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Coins className="h-3 w-3" />
              Coins
            </span>
            <span className="text-sm font-bold">1250</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Navigation
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Today Section */}
        <div className="p-4 border-t border-border">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Today
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tasks</span>
              <span className="font-medium">2/3</span>
            </div>
            <div className="flex justify-between">
              <span>Online</span>
              <span className="font-medium">247</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-border space-y-1">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted",
              pathname === '/profile' && "bg-primary text-primary-foreground"
            )}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted",
              pathname === '/settings' && "bg-primary text-primary-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
