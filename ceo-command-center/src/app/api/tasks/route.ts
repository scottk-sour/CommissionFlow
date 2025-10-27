import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTaskSchema } from '@/lib/validations/task'
import { checkFeatureAccess } from '@/lib/subscription'
import { z } from 'zod'

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const projectId = searchParams.get('projectId')
    const dueDate = searchParams.get('dueDate')

    const where: any = { userId: session.user.id }

    if (status) {
      where.status = status
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (dueDate === 'today') {
      where.dueDate = {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      }
    } else if (dueDate === 'week') {
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      where.dueDate = {
        gte: today,
        lte: weekFromNow,
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'asc' },
        { dueDate: 'asc' },
      ],
    })

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a task
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check feature access
    const access = await checkFeatureAccess(session.user.id, 'tasks')
    if (!access.allowed) {
      return NextResponse.json(
        { success: false, error: access.reason, limit: access.limit, current: access.current },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validated = createTaskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        ...validated,
        userId: session.user.id,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, task }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('POST /api/tasks error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
