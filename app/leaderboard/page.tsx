'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/etw/app-sidebar'
import { FloatingChat } from '@/components/etw/floating-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Crown, Zap, Users, TrendingUp, Medal } from 'lucide-react'

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

const mockLeaderboard = {
  global: [
    { rank: 1, username: 'Alpha_Wolf', points: 3247, streak: 45, level: 'b-force', role: 'mentor' },
    { rank: 2, username: 'IronMind', points: 3156, streak: 32, level: 'gentlemen', role: 'captain' },
    { rank: 3, username: 'Hugo', points: 2847, streak: 23, level: 'b-force', role: 'admin' },
    { rank: 4, username: 'Warrior_23', points: 2654, streak: 18, level: 'soldier', role: 'disciplined' },
    { rank: 5, username: 'Phoenix_Rise', points: 2543, streak: 27, level: 'gentlemen', role: 'member' },
    { rank: 6, username: 'Steel_Mind', points: 2456, streak: 15, level: 'soldier', role: 'member' },
    { rank: 7, username: 'Thunder_Strike', points: 2398, streak: 22, level: 'soldier', role: 'member' },
    { rank: 8, username: 'Diamond_Will', points: 2287, streak: 19, level: 'learner', role: 'member' },
    { rank: 9, username: 'Fire_Soul', points: 2156, streak: 31, level: 'learner', role: 'member' },
    { rank: 10, username: 'Ice_Breaker', points: 2098, streak: 12, level: 'learner', role: 'member' }
  ],
  weekly: [
    { rank: 1, username: 'Hugo', points: 347, streak: 7, level: 'b-force', role: 'admin' },
    { rank: 2, username: 'Alpha_Wolf', points: 324, streak: 7, level: 'b-force', role: 'mentor' },
    { rank: 3, username: 'Phoenix_Rise', points: 298, streak: 6, level: 'gentlemen', role: 'member' }
  ],
  teams: [
    { rank: 1, name: 'Elite Warriors', members: 5, totalPoints: 12847, leader: 'Alpha_Wolf' },
    { rank: 2, name: 'Iron Brotherhood', members: 4, totalPoints: 11256, leader: 'IronMind' },
    { rank: 3, name: 'Phoenix Squad', members: 5, totalPoints: 10943, leader: 'Hugo' }
  ]
}

export default function LeaderboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />
      case 2: return <Medal className="h-4 w-4 text-gray-400" />
      case 3: return <Medal className="h-4 w-4 text-amber-600" />
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
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
    <div className="flex h-screen bg-background">
      <AppSidebar user={mockUser} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-muted-foreground mt-1">
                See how you rank against other ETW members
              </p>
            </div>
          </div>

          <Tabs defaultValue="global" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="global">Global Rankings</TabsTrigger>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="teams">Team Rankings</TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-6">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockLeaderboard.global.slice(0, 3).map((user, index) => (
                  <Card key={user.rank} className={`${
                    user.rank === 1 ? 'border-yellow-500/50 bg-yellow-500/5' :
                    user.rank === 2 ? 'border-gray-400/50 bg-gray-400/5' :
                    'border-amber-600/50 bg-amber-600/5'
                  } ${index === 1 ? 'md:order-first' : index === 0 ? 'md:order-2' : 'md:order-3'}`}>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarFallback className="text-lg">
                          {user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg">{user.username}</h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-2xl">{getLevelEmoji(user.level)}</span>
                        <Badge variant="secondary">{user.level}</Badge>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{user.points} SP</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.streak} day streak
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Full Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle>Global Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaderboard.global.map((user) => (
                      <div
                        key={user.rank}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          user.username === mockUser.username 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-8 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-lg">{getLevelEmoji(user.level)}</span>
                            {user.role !== 'member' && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {user.role}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.streak} day streak
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{user.points} SP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    This Week's Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaderboard.weekly.map((user) => (
                      <div
                        key={user.rank}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          user.username === mockUser.username 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-8 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-lg">{getLevelEmoji(user.level)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.streak}/7 days active
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{user.points} SP</div>
                          <div className="text-xs text-muted-foreground">this week</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaderboard.teams.map((team) => (
                      <div
                        key={team.rank}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50"
                      >
                        <div className="w-8 flex justify-center">
                          {getRankIcon(team.rank)}
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Led by {team.leader} • {team.members} members
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{team.totalPoints} SP</div>
                          <div className="text-xs text-muted-foreground">total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <FloatingChat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  )
}
