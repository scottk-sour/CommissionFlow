import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  category: z.enum(['BUSINESS', 'PERSONAL', 'LEARNING', 'HEALTH', 'CREATIVE', 'OTHER']),
  priority: z.enum(['P0_CRITICAL', 'P1_HIGH', 'P2_MEDIUM', 'P3_LOW']).default('P2_MEDIUM'),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETE', 'CANCELED']).default('ACTIVE'),
  startDate: z.string().optional(),
  targetEndDate: z.string().optional(),
  color: z.string().default('#3B82F6'),
  goalId: z.string().optional(),
})

// GET /api/projects - Get all projects for the user
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as any }),
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        goal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Calculate task completion for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const completedTasks = await prisma.task.count({
          where: {
            projectId: project.id,
            status: 'DONE',
          },
        })

        const totalTasks = project._count.tasks
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        return {
          ...project,
          progress,
          taskCount: totalTasks,
          completedTaskCount: completedTasks,
        }
      })
    )

    return NextResponse.json({ success: true, data: projectsWithProgress })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = createProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name: validated.name,
        description: validated.description,
        category: validated.category,
        priority: validated.priority,
        status: validated.status,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        targetEndDate: validated.targetEndDate ? new Date(validated.targetEndDate) : null,
        color: validated.color,
        goalId: validated.goalId,
      },
      include: {
        goal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
