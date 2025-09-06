'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  Target,
  Dumbbell,
  Brain,
  Heart,
  Zap,
  Calendar,
  Trophy,
  Flame,
  BarChart3
} from 'lucide-react'

// Mock data for charts
const strengthData = [
  { month: 'Jan', bench: 75, squat: 100, deadlift: 120 },
  { month: 'Feb', bench: 78, squat: 105, deadlift: 125 },
  { month: 'Mar', bench: 80, squat: 110, deadlift: 130 },
  { month: 'Apr', bench: 82, squat: 115, deadlift: 135 },
  { month: 'May', bench: 85, squat: 120, deadlift: 140 },
  { month: 'Jun', bench: 85, squat: 120, deadlift: 140 },
]

const cashflowData = [
  { month: 'Jan', income: 2500, expenses: 2200, profit: 300 },
  { month: 'Feb', income: 2800, expenses: 2300, profit: 500 },
  { month: 'Mar', income: 3200, expenses: 2400, profit: 800 },
  { month: 'Apr', income: 3500, expenses: 2500, profit: 1000 },
  { month: 'May', income: 3800, expenses: 2600, profit: 1200 },
  { month: 'Jun', income: 4200, expenses: 2700, profit: 1500 },
]

const bmiData = [
  { month: 'Jan', bmi: 24.5, weight: 78, bodyFat: 15 },
  { month: 'Feb', bmi: 24.2, weight: 77, bodyFat: 14.5 },
  { month: 'Mar', bmi: 24.0, weight: 76.5, bodyFat: 14 },
  { month: 'Apr', bmi: 23.8, weight: 76, bodyFat: 13.5 },
  { month: 'May', bmi: 23.6, weight: 75.5, bodyFat: 13 },
  { month: 'Jun', bmi: 23.4, weight: 75, bodyFat: 12.5 },
]

const activityData = [
  { day: 'Mon', workouts: 1, tasks: 3, study: 2 },
  { day: 'Tue', workouts: 1, tasks: 3, study: 1 },
  { day: 'Wed', workouts: 0, tasks: 2, study: 2 },
  { day: 'Thu', workouts: 1, tasks: 3, study: 1 },
  { day: 'Fri', workouts: 1, tasks: 3, study: 2 },
  { day: 'Sat', workouts: 1, tasks: 2, study: 1 },
  { day: 'Sun', workouts: 0, tasks: 1, study: 3 },
]

const campusDistribution = [
  { name: 'Sport', value: 40, color: '#ef4444' },
  { name: 'Business', value: 30, color: '#f59e0b' },
  { name: 'Behavior', value: 20, color: '#10b981' },
  { name: 'Talking', value: 10, color: '#3b82f6' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress across all areas of life
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strength Points</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,200</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +20% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.4</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -0.2 from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Personal best!
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fitness" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fitness">💪 Fitness</TabsTrigger>
            <TabsTrigger value="business">💼 Business</TabsTrigger>
            <TabsTrigger value="health">❤️ Health</TabsTrigger>
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="fitness" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strength Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Strength Progress (kg)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={strengthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bench" stroke="#ef4444" strokeWidth={2} name="Bench Press" />
                      <Line type="monotone" dataKey="squat" stroke="#f59e0b" strokeWidth={2} name="Squat" />
                      <Line type="monotone" dataKey="deadlift" stroke="#10b981" strokeWidth={2} name="Deadlift" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Current Lifts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Current Max Lifts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Bench Press</span>
                      <span className="font-bold">85kg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="text-xs text-muted-foreground">Goal: 100kg</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Squat</span>
                      <span className="font-bold">120kg</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <div className="text-xs text-muted-foreground">Goal: 150kg</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Deadlift</span>
                      <span className="font-bold">140kg</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <div className="text-xs text-muted-foreground">Goal: 200kg</div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-xl font-bold">345kg</span>
                    </div>
                    <div className="text-xs text-muted-foreground">+15kg this month</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cashflow Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Monthly Cashflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={cashflowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, '']} />
                      <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Income" />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Business Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Business Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-500">$1,500</div>
                      <div className="text-sm text-muted-foreground">Monthly Profit</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">42</div>
                      <div className="text-sm text-muted-foreground">Active Clients</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Revenue Goal</span>
                      <span className="font-bold">$4,200 / $10,000</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    <div className="text-xs text-muted-foreground">42% to yearly goal</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Client Retention</span>
                      <span className="font-bold">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    <div className="text-xs text-muted-foreground">Above industry average</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BMI & Weight Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Body Composition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bmiData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={2} name="BMI" />
                      <Line type="monotone" dataKey="bodyFat" stroke="#ef4444" strokeWidth={2} name="Body Fat %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Health Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-500">75kg</div>
                      <div className="text-sm text-muted-foreground">Current Weight</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">12.5%</div>
                      <div className="text-sm text-muted-foreground">Body Fat</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>BMI Status</span>
                      <Badge variant="default">Normal</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      BMI: 23.4 (Healthy range: 18.5-24.9)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sleep Quality</span>
                      <span className="font-bold">8.2/10</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    <div className="text-xs text-muted-foreground">Average 7.5h per night</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hydration</span>
                      <span className="font-bold">2.8L / 3L</span>
                    </div>
                    <Progress value={93} className="h-2" />
                    <div className="text-xs text-muted-foreground">Daily water intake</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="workouts" fill="#ef4444" name="Workouts" />
                      <Bar dataKey="tasks" fill="#f59e0b" name="Tasks" />
                      <Bar dataKey="study" fill="#10b981" name="Study Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Campus Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={campusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {campusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 space-y-2">
                    {campusDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Dumbbell className="h-6 w-6" />
                    <span className="text-sm">Log Workout</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Add Revenue</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Update Weight</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Target className="h-6 w-6" />
                    <span className="text-sm">Set Goal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
