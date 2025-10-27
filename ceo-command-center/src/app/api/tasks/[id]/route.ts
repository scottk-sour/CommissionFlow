import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateTaskSchema } from '@/lib/validations/task'
import { z } from 'zod'

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
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

    if (!task || task.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('GET /api/tasks/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify task belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      select: { userId: true, status: true },
    })

    if (!existingTask || existingTask.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await request.json()
    const validated = updateTaskSchema.parse(body)

    // If marking as done, set completedAt
    const updateData: any = {
      ...validated,
    }

    if (validated.dueDate) {
      updateData.dueDate = new Date(validated.dueDate)
    }

    if (validated.status === 'DONE' && existingTask.status !== 'DONE') {
      updateData.completedAt = new Date()
    } else if (validated.status && validated.status !== 'DONE') {
      updateData.completedAt = null
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ success: true, task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('PATCH /api/tasks/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify task belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!existingTask || existingTask.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
