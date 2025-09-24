'use client'

import { AppSidebar } from '@/components/etw/app-sidebar'
import CalendarDashboard from '@/components/etw/calendar-dashboard'

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
export default function CalendarPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={mockUser} />
      <main className="flex-1 overflow-auto p-6">
        <CalendarDashboard />
      </main>
    </div>
  )
}
