import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateHabitSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(['HEALTH', 'PRODUCTIVITY', 'LEARNING', 'SOCIAL', 'CREATIVE', 'OTHER']).optional(),
  frequency: z.enum(['DAILY', 'WEEKDAY', 'WEEKEND', 'WEEKLY', 'CUSTOM']).optional(),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME']).optional(),
  whyImportant: z.string().optional(),
  active: z.boolean().optional(),
})

// GET /api/habits/[id] - Get a single habit
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 30, // Last 30 days
        },
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: habit })
  } catch (error) {
    console.error('Error fetching habit:', error)
    return NextResponse.json({ error: 'Failed to fetch habit' }, { status: 500 })
  }
}

// PATCH /api/habits/[id] - Update a habit
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = updateHabitSchema.parse(body)

    // Check if habit exists and belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    const habit = await prisma.habit.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json({ success: true, data: habit })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating habit:', error)
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 })
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if habit exists and belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    await prisma.habit.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Habit deleted' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 })
  }
}
