'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/etw/app-sidebar'
import { FloatingChat } from '@/components/etw/floating-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Crown, 
  Zap, 
  Target, 
  Trophy,
  Calendar,
  Mail,
  MapPin,
  Link as LinkIcon
} from 'lucide-react'

const mockUser = {
  id: '1',
  username: 'Hugo',
  full_name: 'Hugo Baechler',
  email: 'hugobaechler5@gmail.com',
  avatar_url: '',
  role: 'admin',
  level: 'b-force',
  strength_points: 2847,
  coins: 1250,
  login_streak: 23,
  bio: 'Escaping the weakness one day at a time. Building businesses and crushing goals. 💪',
  location: 'Switzerland',
  website: 'https://hugo.dev',
  joined_date: '2024-01-15',
  total_tasks_completed: 156,
  best_streak: 45
}

export default function ProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: mockUser.full_name,
    bio: mockUser.bio,
    location: mockUser.location,
    website: mockUser.website
  })

  const handleSave = () => {
    // Here you would save to Supabase
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      full_name: mockUser.full_name,
      bio: mockUser.bio,
      location: mockUser.location,
      website: mockUser.website
    })
    setIsEditing(false)
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-primary'
      case 'mentor': return 'text-purple-400'
      case 'captain': return 'text-red-400'
      case 'disciplined': return 'text-yellow-400'
      default: return 'text-muted-foreground'
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
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground mt-1">
                Manage your ETW profile and settings
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={mockUser.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {mockUser.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getLevelEmoji(mockUser.level)}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{mockUser.username}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={getRoleColor(mockUser.role)}>
                            <Crown className="h-3 w-3 mr-1" />
                            {mockUser.role}
                          </Badge>
                          <Badge variant="outline">
                            {mockUser.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{mockUser.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{mockUser.location}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={mockUser.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {mockUser.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{mockUser.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Strength Points</span>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{mockUser.strength_points}</span>
                    </div>
                  </div>
                  <Progress value={(mockUser.strength_points % 1000) / 10} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Coins</span>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-chart-3" />
                      <span className="font-semibold">{mockUser.coins}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Streak</span>
                    <Badge variant="secondary">{mockUser.login_streak} days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best Streak</span>
                    <Badge variant="outline">{mockUser.best_streak} days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasks Completed</span>
                    <span className="font-semibold">{mockUser.total_tasks_completed}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Member Since
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(mockUser.joined_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.floor((Date.now() - new Date(mockUser.joined_date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <FloatingChat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  )
}
