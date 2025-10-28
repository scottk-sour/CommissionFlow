import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Target, Calendar, TrendingUp } from 'lucide-react'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'

async function getDashboardStats(userId: string) {
  const [tasksToday, tasksCompleted, activeProjects, activeHabits] = await Promise.all([
    prisma.task.count({
      where: {
        userId,
        status: { in: ['TODO', 'IN_PROGRESS'] },
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.task.count({
      where: {
        userId,
        status: 'DONE',
        completedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.project.count({
      where: {
        userId,
        status: 'ACTIVE',
      },
    }),
    prisma.habit.count({
      where: {
        userId,
        active: true,
      },
    }),
  ])

  return {
    tasksToday,
    tasksCompleted,
    activeProjects,
    activeHabits,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true },
  })

  const stats = await getDashboardStats(session.user.id)

  const dashboardContent = (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Today
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.tasksCompleted} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Habits
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeHabits}</div>
            <p className="text-xs text-muted-foreground">
              Tracking daily
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Week Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tasksCompleted > 0 ? '↑' : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              Keep going!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Jump into your most important features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/tasks"
              className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Manage Tasks</h3>
              <p className="text-sm text-muted-foreground">
                View and organize your to-do list
              </p>
            </a>

            <a
              href="/projects"
              className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Target className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Track Projects</h3>
              <p className="text-sm text-muted-foreground">
                Monitor progress on your initiatives
              </p>
            </a>

            <a
              href="/goals"
              className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Review Goals</h3>
              <p className="text-sm text-muted-foreground">
                Stay aligned with your objectives
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <OnboardingProvider showOnboarding={!user?.onboardingCompleted}>
      {dashboardContent}
    </OnboardingProvider>
  )
}
