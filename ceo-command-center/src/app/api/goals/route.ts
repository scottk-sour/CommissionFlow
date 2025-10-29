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

const createGoalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  category: z.enum(['BUSINESS', 'PERSONAL', 'LEARNING', 'HEALTH', 'CREATIVE', 'OTHER']),
  timeframe: z.enum(['THIS_QUARTER', 'THIS_YEAR', 'THREE_YEAR', 'FIVE_YEAR']),
  status: z.enum(['ON_TRACK', 'AT_RISK', 'BEHIND', 'ACHIEVED', 'ABANDONED']).default('ON_TRACK'),
  progress: z.number().min(0).max(100).default(0),
  targetDate: z.string().optional(),
  whyItMatters: z.string().optional(),
  keyResults: z.array(keyResultSchema).optional(),
})

// GET /api/goals - Get all goals for the user
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timeframe = searchParams.get('timeframe')
    const status = searchParams.get('status')

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
        ...(timeframe && { timeframe: timeframe as any }),
        ...(status && { status: status as any }),
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ success: true, data: goals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

// POST /api/goals - Create a new goal
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = createGoalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        name: validated.name,
        description: validated.description,
        category: validated.category,
        timeframe: validated.timeframe,
        status: validated.status,
        progress: validated.progress,
        targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
        whyItMatters: validated.whyItMatters,
        keyResults: validated.keyResults || [],
      },
    })

    return NextResponse.json({ success: true, data: goal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}
