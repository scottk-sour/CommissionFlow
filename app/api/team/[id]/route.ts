import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['admin', 'manager', 'telesales', 'bdm']).optional(),
  commissionRate: z.number().min(0).max(1).optional(),
  active: z.boolean().optional(),
})

// GET /api/team/[id] - Get a specific team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .select('organization_id')
      .eq('id', session.user.id)
      .single()

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: member, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .eq('organization_id', currentUser.organization_id)
      .single()

    if (error || !member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Get team member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/team/[id] - Update a team member
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Only admins and managers can update team members
    if (!['admin', 'manager'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Verify member belongs to same organization
    const { data: existingMember } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', params.id)
      .eq('organization_id', currentUser.organization_id)
      .single()

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Prevent demoting the last admin
    const body = await request.json()
    const validation = updateMemberSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const updateData = validation.data

    // If changing role from admin, ensure there's at least one admin left
    if (existingMember.role === 'admin' && updateData.role && updateData.role !== 'admin') {
      const { count } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('organization_id', currentUser.organization_id)
        .eq('role', 'admin')
        .eq('active', true)

      if (count !== null && count <= 1) {
        return NextResponse.json(
          { error: 'Cannot change role - organization must have at least one admin' },
          { status: 400 }
        )
      }
    }

    // Build update object
    const updates: Record<string, unknown> = {}
    if (updateData.name !== undefined) updates.name = updateData.name
    if (updateData.role !== undefined) updates.role = updateData.role
    if (updateData.commissionRate !== undefined) updates.commission_rate = updateData.commissionRate
    if (updateData.active !== undefined) updates.active = updateData.active

    const { data: member, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .eq('organization_id', currentUser.organization_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating team member:', error)
      return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Update team member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
