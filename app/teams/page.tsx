'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/etw/app-sidebar'
import { FloatingChat } from '@/components/etw/floating-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Plus, Crown, Target, Trophy } from 'lucide-react'

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

export default function TeamsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={mockUser} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Teams</h1>
              <p className="text-muted-foreground mt-1">
                Join or create a team to compete together
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Available Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Teams Coming Soon</h3>
                <p className="text-muted-foreground">
                  Team functionality will be available in the next update
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
