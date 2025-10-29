import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { startOfDay } from 'date-fns'

const logHabitSchema = z.object({
  date: z.string().optional(), // Defaults to today
  notes: z.string().optional(),
})

// POST /api/habits/[id]/log - Log a habit completion
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = logHabitSchema.parse(body)

    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    const logDate = validated.date ? startOfDay(new Date(validated.date)) : startOfDay(new Date())

    // Check if log already exists for this date
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: params.id,
        userId: session.user.id,
        date: logDate,
      },
    })

    if (existingLog) {
      // If log exists, delete it (toggle off)
      await prisma.habitLog.delete({
        where: { id: existingLog.id },
      })

      return NextResponse.json({ success: true, action: 'removed', message: 'Habit log removed' })
    } else {
      // Create new log
      const log = await prisma.habitLog.create({
        data: {
          userId: session.user.id,
          habitId: params.id,
          date: logDate,
          notes: validated.notes,
        },
      })

      return NextResponse.json({ success: true, action: 'added', data: log }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error logging habit:', error)
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 })
  }
}

// GET /api/habits/[id]/log - Get logs for a habit
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '30')

    const logs = await prisma.habitLog.findMany({
      where: {
        habitId: params.id,
        userId: session.user.id,
      },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    console.error('Error fetching habit logs:', error)
    return NextResponse.json({ error: 'Failed to fetch habit logs' }, { status: 500 })
  }
}
