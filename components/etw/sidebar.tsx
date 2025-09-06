'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Target, 
  Trophy, 
  Users, 
  Settings, 
  BookOpen,
  MessageCircle,
  Calendar,
  BarChart3,
  Crown,
  Zap,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge' // ⬅️ IMPORT SHADCN
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar' // ⬅️ IMPORT SHADCN

const routes = [
  // [Garde tout le reste du code sidebar intact]
  // ... ton code actuel ...
]

interface SidebarProps {
  user?: {
    id: string
    username: string
    avatar_url: string
    role: string
    level: string
    strength_points: number
    coins: number
    login_streak: number
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* [Garde tout le code actuel de ta sidebar] */}
      {/* ... ton code actuel ... */}
    </div>
  )
}

// ⚠️ SUPPRIME les composants personnalisés Badge et Avatar à la fin du fichier
// Ils sont déjà fournis par Shadcn/UI !