import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient, createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']

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

    const adminClient = createAdminClient()

    const { data: currentUser } = await adminClient
      .from('users')
      .select('organization_id')
      .eq('id', session.user.id)
      .single() as { data: Pick<User, 'organization_id'> | null; error: unknown }

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: member, error } = await adminClient
      .from('users')
      .select('*')
      .eq('id', params.id)
      .eq('organization_id', currentUser.organization_id)
      .single() as { data: User | null; error: unknown }

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

    const adminClient = createAdminClient()

    const { data: currentUser } = await adminClient
      .from('users')
      .select('organization_id, role')
      .eq('id', session.user.id)
      .single() as { data: Pick<User, 'organization_id' | 'role'> | null; error: unknown }

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only admins and managers can update team members
    if (!['admin', 'manager'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Verify member belongs to same organization
    const { data: existingMember } = await adminClient
      .from('users')
      .select('id, role')
      .eq('id', params.id)
      .eq('organization_id', currentUser.organization_id)
      .single() as { data: Pick<User, 'id' | 'role'> | null; error: unknown }

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
      const { count } = await adminClient
        .from('users')
        .select('id', { count: 'exact' })
        .eq('organization_id', currentUser.organization_id)
        .eq('role', 'admin')
        .eq('active', true) as { count: number | null }

      if (count !== null && count <= 1) {
        return NextResponse.json(
          { error: 'Cannot change role - organization must have at least one admin' },
          { status: 400 }
        )
      }
    }

    // Build update object
    type UserUpdate = Database['public']['Tables']['users']['Update']
    const updates: UserUpdate = {}
    if (updateData.name !== undefined) updates.name = updateData.name
    if (updateData.role !== undefined) updates.role = updateData.role
    if (updateData.commissionRate !== undefined) updates.commission_rate = updateData.commissionRate
    if (updateData.active !== undefined) updates.active = updateData.active

    const { data: member, error } = await adminClient
      .from('users')
      .update(updates as never)
      .eq('id', params.id)
      .eq('organization_id', currentUser.organization_id)
      .select()
      .single() as { data: User | null; error: { message: string } | null }

    if (error) {
      console.error('Error updating team member:', error)
      return NextResponse.json({ error: 'Failed to update team member: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Update team member error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
