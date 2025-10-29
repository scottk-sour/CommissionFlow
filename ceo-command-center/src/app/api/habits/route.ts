import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { startOfDay, subDays, format } from 'date-fns'

const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  category: z.enum(['HEALTH', 'PRODUCTIVITY', 'LEARNING', 'SOCIAL', 'CREATIVE', 'OTHER']),
  frequency: z.enum(['DAILY', 'WEEKDAY', 'WEEKEND', 'WEEKLY', 'CUSTOM']).default('DAILY'),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME']).optional(),
  whyImportant: z.string().optional(),
  active: z.boolean().default(true),
})

// Calculate streak for a habit
async function calculateStreak(habitId: string, userId: string): Promise<{ currentStreak: number; bestStreak: number }> {
  const logs = await prisma.habitLog.findMany({
    where: {
      habitId,
      userId,
    },
    orderBy: { date: 'desc' },
    take: 100, // Check last 100 days
  })

  if (logs.length === 0) {
    return { currentStreak: 0, bestStreak: 0 }
  }

  let currentStreak = 0
  let bestStreak = 0
  let consecutiveStreak = 0

  const today = startOfDay(new Date())
  const yesterday = startOfDay(subDays(today, 1))

  // Check if there's a log for today or yesterday
  const latestLogDate = startOfDay(new Date(logs[0].date))
  const daysSinceLatest = Math.floor((today.getTime() - latestLogDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLatest <= 1) {
    // Current streak is active
    let checkDate = latestLogDate
    for (const log of logs) {
      const logDate = startOfDay(new Date(log.date))
      if (logDate.getTime() === checkDate.getTime()) {
        currentStreak++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }
  }

  // Calculate best streak
  let tempStreak = 0
  let prevDate: Date | null = null

  for (const log of logs) {
    const logDate = startOfDay(new Date(log.date))

    if (!prevDate) {
      tempStreak = 1
    } else {
      const daysDiff = Math.floor((prevDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        tempStreak++
      } else {
        bestStreak = Math.max(bestStreak, tempStreak)
        tempStreak = 1
      }
    }

    prevDate = logDate
  }

  bestStreak = Math.max(bestStreak, tempStreak)

  return { currentStreak, bestStreak }
}

// GET /api/habits - Get all habits for the user
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') === 'true'

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        ...(activeOnly && { active: true }),
      },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 7, // Last 7 days
        },
      },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Update streaks for all habits
    const habitsWithStreaks = await Promise.all(
      habits.map(async (habit) => {
        const { currentStreak, bestStreak } = await calculateStreak(habit.id, session.user.id)

        // Update if changed
        if (habit.currentStreak !== currentStreak || habit.bestStreak !== bestStreak) {
          await prisma.habit.update({
            where: { id: habit.id },
            data: { currentStreak, bestStreak },
          })
        }

        return {
          ...habit,
          currentStreak,
          bestStreak,
        }
      })
    )

    return NextResponse.json({ success: true, data: habitsWithStreaks })
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
  }
}

// POST /api/habits - Create a new habit
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = createHabitSchema.parse(body)

    const habit = await prisma.habit.create({
      data: {
        userId: session.user.id,
        name: validated.name,
        description: validated.description,
        category: validated.category,
        frequency: validated.frequency,
        timeOfDay: validated.timeOfDay,
        whyImportant: validated.whyImportant,
        active: validated.active,
      },
    })

    return NextResponse.json({ success: true, data: habit }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating habit:', error)
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
  }
}
