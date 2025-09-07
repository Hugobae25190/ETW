'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppSidebar } from '@/components/etw/app-sidebar'
import { Sidebar } from '@/components/etw/sidebar'
import {
  Play,
  Pause,
  SkipForward,
  Bookmark,
  BookmarkCheck,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  PlayCircle,
  Lock
} from 'lucide-react'

interface Course {
  id: string
  title: string
  instructor: string
  duration: string
  progress: number
  totalVideos: number
  completedVideos: number
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  isLocked: boolean
}

interface Video {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isBookmarked: boolean
  bookmarkTime?: string
  description: string
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Strength Training Fundamentals',
    instructor: 'Marcus Steel',
    duration: '4h 32m',
    progress: 65,
    totalVideos: 12,
    completedVideos: 8,
    category: 'Sport',
    level: 'Beginner',
    thumbnail: '💪',
    isLocked: false
  },
  {
    id: '2',
    title: 'Business Mindset Mastery',
    instructor: 'Sarah Johnson',
    duration: '6h 15m',
    progress: 30,
    totalVideos: 18,
    completedVideos: 5,
    category: 'Business',
    level: 'Intermediate',
    thumbnail: '💼',
    isLocked: false
  },
  {
    id: '3',
    title: 'Advanced Discipline Techniques',
    instructor: 'David Chen',
    duration: '3h 45m',
    progress: 0,
    totalVideos: 10,
    completedVideos: 0,
    category: 'Behavior',
    level: 'Advanced',
    thumbnail: '🎯',
    isLocked: true
  }
]

const videos: { [key: string]: Video[] } = {
  '1': [
    {
      id: '1-1',
      title: 'Introduction to Strength Training',
      duration: '12:34',
      isCompleted: true,
      isBookmarked: false,
      description: 'Learn the basics of strength training and proper form'
    },
    {
      id: '1-2',
      title: 'Compound Movements Mastery',
      duration: '18:45',
      isCompleted: true,
      isBookmarked: true,
      bookmarkTime: '8:23',
      description: 'Master the big three: squat, bench, deadlift'
    },
    {
      id: '1-3',
      title: 'Progressive Overload Principles',
      duration: '15:20',
      isCompleted: false,
      isBookmarked: false,
      description: 'How to continuously challenge your muscles'
    }
  ],
  '2': [
    {
      id: '2-1',
      title: 'Entrepreneurial Mindset',
      duration: '22:15',
      isCompleted: true,
      isBookmarked: true,
      bookmarkTime: '15:42',
      description: 'Develop the mindset of successful entrepreneurs'
    },
    {
      id: '2-2',
      title: 'Building Your First Business',
      duration: '28:30',
      isCompleted: false,
      isBookmarked: false,
      description: 'Step-by-step guide to starting your business'
    }
  ]
}

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

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleVideoComplete = (videoId: string) => {
    if (selectedCourse) {
      const courseVideos = videos[selectedCourse.id]
      const videoIndex = courseVideos.findIndex(v => v.id === videoId)
      if (videoIndex !== -1) {
        courseVideos[videoIndex].isCompleted = true

        // Auto-advance to next video
        if (videoIndex < courseVideos.length - 1) {
          const nextVideo = courseVideos[videoIndex + 1]
          setCurrentVideo(nextVideo)
        }
      }
    }
  }

  const toggleBookmark = (videoId: string, time?: string) => {
    if (selectedCourse) {
      const courseVideos = videos[selectedCourse.id]
      const video = courseVideos.find(v => v.id === videoId)
      if (video) {
        video.isBookmarked = !video.isBookmarked
        if (video.isBookmarked && time) {
          video.bookmarkTime = time
        }
      }
    }
  }

  // --------------------
  // Mode cours sélectionné
  // --------------------
  if (selectedCourse && currentVideo) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar user={mockUser} />
        <Sidebar user={mockUser} />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center relative">
                      <div className="text-white text-center">
                        <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg font-medium">{currentVideo.title}</p>
                        <p className="text-sm opacity-70">{currentVideo.duration}</p>
                      </div>

                      {/* Video Controls */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-4 bg-black/50 rounded-lg p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>

                          <div className="flex-1">
                            <Progress value={45} className="h-2" />
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(currentVideo.id, '8:23')}
                            className="text-white hover:bg-white/20"
                          >
                            {currentVideo.isBookmarked
                              ? <BookmarkCheck className="h-4 w-4" />
                              : <Bookmark className="h-4 w-4" />
                            }
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVideoComplete(currentVideo.id)}
                            className="text-white hover:bg-white/20"
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                      <p className="text-muted-foreground mb-4">{currentVideo.description}</p>

                      <div className="flex items-center gap-4">
                        <Badge variant={currentVideo.isCompleted ? 'default' : 'secondary'}>
                          {currentVideo.isCompleted ? 'Completed' : 'In Progress'}
                        </Badge>
                        {currentVideo.isBookmarked && (
                          <Badge variant="outline">
                            <Bookmark className="h-3 w-3 mr-1" />
                            Bookmarked at {currentVideo.bookmarkTime}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedCourse.thumbnail}</span>
                      {selectedCourse.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {selectedCourse.instructor}
                      <Clock className="h-4 w-4 ml-2" />
                      {selectedCourse.duration}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{selectedCourse.completedVideos}/{selectedCourse.totalVideos}</span>
                        </div>
                        <Progress value={selectedCourse.progress} />
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Course Content</h4>
                        {videos[selectedCourse.id]?.map((video) => (
                          <div
                            key={video.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              currentVideo.id === video.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:bg-muted'
                            }`}
                            onClick={() => setCurrentVideo(video)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {video.isCompleted
                                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                                  : <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{video.title}</p>
                                <p className="text-xs text-muted-foreground">{video.duration}</p>
                              </div>
                              {video.isBookmarked && (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedCourse(null)
                          setCurrentVideo(null)
                        }}
                      >
                        Back to Courses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --------------------
  // Mode liste des cours
  // --------------------
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={mockUser} />
      <Sidebar user={mockUser} />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Courses</h1>
            <p className="text-muted-foreground">
              Master new skills with our comprehensive video courses
            </p>
          </div>

          <Tabs defaultValue="sport" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sport">Sport 💪</TabsTrigger>
              <TabsTrigger value="business">Business 💼</TabsTrigger>
              <TabsTrigger value="behavior">Behavior 🎯</TabsTrigger>
              <TabsTrigger value="talking">Talking 🗣️</TabsTrigger>
            </TabsList>

            {/* SPORT */}
            <TabsContent value="sport" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(c => c.category === 'Sport').map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-4xl">{course.thumbnail}</div>
                        {course.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {course.instructor}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </span>
                          <Badge
                            variant={
                              course.level === 'Beginner'
                                ? 'default'
                                : course.level === 'Intermediate'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {course.level}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{course.completedVideos}/{course.totalVideos}</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>

                        <Button
                          className="w-full"
                          disabled={course.isLocked}
                          onClick={() => {
                            setSelectedCourse(course)
                            const courseVideos = videos[course.id]
                            if (courseVideos && courseVideos.length > 0) {
                              setCurrentVideo(courseVideos[0])
                            }
                          }}
                        >
                          {course.isLocked
                            ? 'Locked'
                            : course.progress > 0
                            ? 'Continue'
                            : 'Start Course'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* BUSINESS */}
            <TabsContent value="business" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(c => c.category === 'Business').map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-4xl">{course.thumbnail}</div>
                        {course.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {course.instructor}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </span>
                          <Badge
                            variant={
                              course.level === 'Beginner'
                                ? 'default'
                                : course.level === 'Intermediate'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {course.level}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{course.completedVideos}/{course.totalVideos}</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>

                        <Button
                          className="w-full"
                          disabled={course.isLocked}
                          onClick={() => {
                            setSelectedCourse(course)
                            const courseVideos = videos[course.id]
                            if (courseVideos && courseVideos.length > 0) {
                              setCurrentVideo(courseVideos[0])
                            }
                          }}
                        >
                          {course.isLocked
                            ? 'Locked'
                            : course.progress > 0
                            ? 'Continue'
                            : 'Start Course'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* BEHAVIOR */}
            <TabsContent value="behavior" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(c => c.category === 'Behavior').map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-4xl">{course.thumbnail}</div>
                        {course.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {course.instructor}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </span>
                          <Badge
                            variant={
                              course.level === 'Beginner'
                                ? 'default'
                                : course.level === 'Intermediate'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {course.level}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{course.completedVideos}/{course.totalVideos}</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>

                        <Button
                          className="w-full"
                          disabled={course.isLocked}
                          onClick={() => {
                            setSelectedCourse(course)
                            const courseVideos = videos[course.id]
                            if (courseVideos && courseVideos.length > 0) {
                              setCurrentVideo(courseVideos[0])
                            }
                          }}
                        >
                          {course.isLocked
                            ? 'Locked'
                            : course.progress > 0
                            ? 'Continue'
                            : 'Start Course'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TALKING */}
            <TabsContent value="talking" className="space-y-6">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Communication and speaking courses will be available soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
