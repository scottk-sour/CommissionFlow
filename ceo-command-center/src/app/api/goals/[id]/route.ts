import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const keyResultSchema = z.object({
  id: z.string(),
  description: z.string(),
  target: z.number(),
  current: z.number(),
  unit: z.string(),
})

const updateGoalSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(['BUSINESS', 'PERSONAL', 'LEARNING', 'HEALTH', 'CREATIVE', 'OTHER']).optional(),
  timeframe: z.enum(['THIS_QUARTER', 'THIS_YEAR', 'THREE_YEAR', 'FIVE_YEAR']).optional(),
  status: z.enum(['ON_TRACK', 'AT_RISK', 'BEHIND', 'ACHIEVED', 'ABANDONED']).optional(),
  progress: z.number().min(0).max(100).optional(),
  targetDate: z.string().nullable().optional(),
  whyItMatters: z.string().optional(),
  keyResults: z.array(keyResultSchema).optional(),
})

// GET /api/goals/[id] - Get a single goal
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: goal })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 })
  }
}

// PATCH /api/goals/[id] - Update a goal
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
    const validated = updateGoalSchema.parse(body)

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // If status is being changed to ACHIEVED, set achievedAt
    const updateData: any = { ...validated }
    if (validated.status === 'ACHIEVED' && existingGoal.status !== 'ACHIEVED') {
      updateData.achievedAt = new Date()
    } else if (validated.status && validated.status !== 'ACHIEVED') {
      updateData.achievedAt = null
    }

    // Handle date conversion
    if (validated.targetDate !== undefined) {
      updateData.targetDate = validated.targetDate ? new Date(validated.targetDate) : null
    }

    const goal = await prisma.goal.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: goal })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating goal:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    await prisma.goal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Goal deleted' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
