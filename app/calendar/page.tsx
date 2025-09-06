'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/etw/app-sidebar'
import { FloatingChat } from '@/components/etw/floating-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

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
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={mockUser} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and upcoming events
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calendar Coming Soon</h3>
                <p className="text-muted-foreground">
                  Calendar functionality will be available in the next update
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FloatingChat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  )
}
