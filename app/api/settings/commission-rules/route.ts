import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient, createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']
type Organization = Database['public']['Tables']['organizations']['Row']

const updateCommissionRulesSchema = z.object({
  bdmThresholdAmount: z.number().min(0).optional(), // in pence
  bdmCommissionRate: z.number().min(0).max(1).optional(), // decimal (0-1)
})

// GET /api/settings/commission-rules - Get commission rules
export async function GET() {
  try {
    const supabase = createRouteClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    const { data: user } = await adminClient
      .from('users')
      .select('organization_id, role')
      .eq('id', session.user.id)
      .single() as { data: Pick<User, 'organization_id' | 'role'> | null; error: unknown }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: org, error } = await adminClient
      .from('organizations')
      .select('bdm_threshold_amount, bdm_commission_rate')
      .eq('id', user.organization_id)
      .single() as { data: Pick<Organization, 'bdm_threshold_amount' | 'bdm_commission_rate'> | null; error: unknown }

    if (error) {
      console.error('Error fetching commission rules:', error)
      return NextResponse.json({ error: 'Failed to fetch commission rules' }, { status: 500 })
    }

    return NextResponse.json({
      bdmThresholdAmount: org?.bdm_threshold_amount || 350000, // Default: £3,500 in pence
      bdmCommissionRate: org?.bdm_commission_rate || 1.0, // Default: 100%
    })
  } catch (error) {
    console.error('Commission rules API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/settings/commission-rules - Update commission rules
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    const { data: user } = await adminClient
      .from('users')
      .select('organization_id, role')
      .eq('id', session.user.id)
      .single() as { data: Pick<User, 'organization_id' | 'role'> | null; error: unknown }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only admins can update commission rules
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can update commission rules' }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateCommissionRulesSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { bdmThresholdAmount, bdmCommissionRate } = validation.data

    type OrgUpdate = Database['public']['Tables']['organizations']['Update']
    const updates: OrgUpdate = {}
    if (bdmThresholdAmount !== undefined) updates.bdm_threshold_amount = bdmThresholdAmount
    if (bdmCommissionRate !== undefined) updates.bdm_commission_rate = bdmCommissionRate

    const { data: org, error } = await adminClient
      .from('organizations')
      .update(updates as never)
      .eq('id', user.organization_id)
      .select('bdm_threshold_amount, bdm_commission_rate')
      .single() as { data: Pick<Organization, 'bdm_threshold_amount' | 'bdm_commission_rate'> | null; error: { message: string } | null }

    if (error) {
      console.error('Error updating commission rules:', error)
      return NextResponse.json({ error: 'Failed to update commission rules: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({
      bdmThresholdAmount: org?.bdm_threshold_amount,
      bdmCommissionRate: org?.bdm_commission_rate,
    })
  } catch (error) {
    console.error('Update commission rules error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
