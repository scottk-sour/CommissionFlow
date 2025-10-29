import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(['BUSINESS', 'PERSONAL', 'LEARNING', 'HEALTH', 'CREATIVE', 'OTHER']).optional(),
  priority: z.enum(['P0_CRITICAL', 'P1_HIGH', 'P2_MEDIUM', 'P3_LOW']).optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETE', 'CANCELED']).optional(),
  startDate: z.string().nullable().optional(),
  targetEndDate: z.string().nullable().optional(),
  color: z.string().optional(),
  goalId: z.string().nullable().optional(),
})

// GET /api/projects/[id] - Get a single project
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        goal: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PATCH /api/projects/[id] - Update a project
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
    const validated = updateProjectSchema.parse(body)

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // If status is being changed to COMPLETE, set completedAt
    const updateData: any = { ...validated }
    if (validated.status === 'COMPLETE' && existingProject.status !== 'COMPLETE') {
      updateData.completedAt = new Date()
    } else if (validated.status && validated.status !== 'COMPLETE') {
      updateData.completedAt = null
    }

    // Handle date conversions
    if (validated.startDate !== undefined) {
      updateData.startDate = validated.startDate ? new Date(validated.startDate) : null
    }
    if (validated.targetEndDate !== undefined) {
      updateData.targetEndDate = validated.targetEndDate ? new Date(validated.targetEndDate) : null
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
      include: {
        goal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
