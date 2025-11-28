import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'manager', 'telesales', 'bdm']),
  commissionRate: z.number().min(0).max(1).optional().default(0.1),
})

// GET /api/team - List all team members
export async function GET() {
  try {
    const supabase = createRouteClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('organization_id, role')
      .eq('id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: members, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', user.organization_id)
      .order('name')

    if (error) {
      console.error('Error fetching team:', error)
      return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
    }

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Team API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/team - Add a new team member
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('organization_id, role')
      .eq('id', session.user.id)
      .single()

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only admins and managers can add team members
    if (!['admin', 'manager'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const body = await request.json()
    const validation = createMemberSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, name, role, commissionRate } = validation.data

    // Check if email already exists in organization
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('organization_id', currentUser.organization_id)
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A team member with this email already exists' },
        { status: 400 }
      )
    }

    // Create the user (note: they'll need to be invited to Supabase Auth separately)
    // For now, create a placeholder user entry
    const { data: member, error } = await supabase
      .from('users')
      .insert({
        organization_id: currentUser.organization_id,
        email,
        name,
        role,
        commission_rate: commissionRate,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating team member:', error)
      return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
    }

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('Create team member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
