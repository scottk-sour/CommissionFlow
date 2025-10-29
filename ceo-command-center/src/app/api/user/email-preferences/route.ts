import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const emailPreferencesSchema = z.object({
  emailDigestEnabled: z.boolean().optional(),
  emailDigestTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:mm format
  emailDigestTimezone: z.string().optional(),
})

// GET /api/user/email-preferences - Get user's email preferences
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailDigestEnabled: true,
        emailDigestTime: true,
        emailDigestTimezone: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error fetching email preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email preferences' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/email-preferences - Update user's email preferences
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const preferences = emailPreferencesSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: preferences,
      select: {
        emailDigestEnabled: true,
        emailDigestTime: true,
        emailDigestTimezone: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email preferences updated',
      data: updatedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating email preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update email preferences' },
      { status: 500 }
    )
  }
}
