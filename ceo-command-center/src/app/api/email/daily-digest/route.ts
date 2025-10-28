import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { render } from '@react-email/render'
import DailyDigestEmail from '@/emails/DailyDigest'
import { startOfDay, endOfDay } from 'date-fns'

// POST /api/email/daily-digest
// Can be called by:
// 1. Cron job with CRON_SECRET header
// 2. User manually (for testing)
export async function POST(req: NextRequest) {
  try {
    // Check for cron secret (for automated sending)
    const cronSecret = req.headers.get('authorization')
    const isCronJob = cronSecret === `Bearer ${process.env.CRON_SECRET}`

    let userId: string

    if (isCronJob) {
      // For cron job, get userId from request body
      const body = await req.json()
      userId = body.userId

      if (!userId) {
        return NextResponse.json({ error: 'userId required for cron job' }, { status: 400 })
      }
    } else {
      // For manual trigger, check user authentication
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = session.user.id
    }

    // Fetch user with email preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        emailDigestEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email digest is enabled
    if (!user.emailDigestEnabled) {
      return NextResponse.json({
        message: 'Email digest is disabled for this user',
        skipped: true
      })
    }

    // Date ranges
    const today = new Date()
    const startOfToday = startOfDay(today)
    const endOfToday = endOfDay(today)

    // Fetch tasks due today (not completed)
    const tasksDueToday = await prisma.task.findMany({
      where: {
        userId,
        status: { in: ['TODO', 'IN_PROGRESS'] },
        dueDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      select: {
        id: true,
        title: true,
        priority: true,
        dueDate: true,
        status: true,
        project: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: [
        { priority: 'asc' }, // P0 first
        { dueDate: 'asc' },
      ],
      take: 10,
    })

    // Fetch overdue tasks (not completed, due before today)
    const overdueTasks = await prisma.task.findMany({
      where: {
        userId,
        status: { in: ['TODO', 'IN_PROGRESS'] },
        dueDate: {
          lt: startOfToday,
        },
      },
      select: {
        id: true,
        title: true,
        priority: true,
        dueDate: true,
        status: true,
        project: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: [
        { priority: 'asc' },
        { dueDate: 'asc' },
      ],
      take: 10,
    })

    // Fetch active habits
    const habitsToday = await prisma.habit.findMany({
      where: {
        userId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        currentStreak: true,
      },
      orderBy: {
        currentStreak: 'desc',
      },
      take: 5,
    })

    // Calculate stats
    const [totalStreakDays, activeProjects, completedTasksThisWeek, totalTasksThisWeek] = await Promise.all([
      // Total streak days across all habits
      prisma.habit.aggregate({
        where: { userId, active: true },
        _sum: { currentStreak: true },
      }).then(result => result._sum.currentStreak || 0),

      // Active projects count
      prisma.project.count({
        where: { userId, status: 'ACTIVE' },
      }),

      // Completed tasks this week
      prisma.task.count({
        where: {
          userId,
          status: 'DONE',
          completedAt: {
            gte: startOfDay(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
          },
        },
      }),

      // Total tasks this week (with due dates)
      prisma.task.count({
        where: {
          userId,
          dueDate: {
            gte: startOfDay(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
            lte: endOfToday,
          },
        },
      }),
    ])

    const completionRate = totalTasksThisWeek > 0
      ? Math.round((completedTasksThisWeek / totalTasksThisWeek) * 100)
      : 0

    const stats = {
      totalStreakDays,
      activeProjects,
      completionRate,
    }

    // Render and send email
    const emailHtml = render(
      DailyDigestEmail({
        userName: user.name?.split(' ')[0] || 'there',
        tasksDueToday,
        overdueTasks,
        habitsToday,
        stats,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      })
    )

    await sendEmail({
      to: user.email,
      subject: `☀️ Your Daily Command Center - ${tasksDueToday.length} tasks due today`,
      react: DailyDigestEmail({
        userName: user.name?.split(' ')[0] || 'there',
        tasksDueToday,
        overdueTasks,
        habitsToday,
        stats,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      }),
    })

    return NextResponse.json({
      success: true,
      message: 'Daily digest sent',
      stats: {
        tasksDueToday: tasksDueToday.length,
        overdueTasks: overdueTasks.length,
        habitsToday: habitsToday.length,
      },
    })

  } catch (error) {
    console.error('Error sending daily digest:', error)
    return NextResponse.json(
      {
        error: 'Failed to send daily digest',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/email/daily-digest
// Send digest to all users who have it enabled at their preferred time
// Called by cron job
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const cronSecret = req.headers.get('authorization')
    if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current hour in different timezones (simplified - you might want to use a timezone library)
    const now = new Date()
    const currentHour = now.getUTCHours()

    // Find users who should receive digest at this hour
    // This is a simplified version - in production, you'd want proper timezone handling
    const users = await prisma.user.findMany({
      where: {
        emailDigestEnabled: true,
      },
      select: {
        id: true,
        email: true,
        emailDigestTime: true,
      },
    })

    const results = []

    for (const user of users) {
      try {
        // Parse the time (HH:mm format)
        const [hour] = user.emailDigestTime.split(':').map(Number)

        // Simple UTC comparison (in production, factor in user's timezone)
        if (hour === currentHour) {
          // Send digest by calling POST endpoint
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/daily-digest`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CRON_SECRET}`,
            },
            body: JSON.stringify({ userId: user.id }),
          })

          results.push({
            userId: user.id,
            email: user.email,
            success: response.ok,
          })
        }
      } catch (error) {
        console.error(`Failed to send digest to user ${user.id}:`, error)
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    })

  } catch (error) {
    console.error('Error in daily digest cron:', error)
    return NextResponse.json(
      { error: 'Failed to send daily digests' },
      { status: 500 }
    )
  }
}
