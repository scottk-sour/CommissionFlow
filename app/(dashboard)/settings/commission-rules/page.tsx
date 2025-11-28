export const dynamic = 'force-dynamic'

import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CommissionRulesForm } from './commission-rules-form'
import type { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']
type Organization = Database['public']['Tables']['organizations']['Row']

async function getCommissionRules() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const adminClient = createAdminClient()

  const { data: user } = await adminClient
    .from('users')
    .select('organization_id, role')
    .eq('id', session.user.id)
    .single() as { data: Pick<User, 'organization_id' | 'role'> | null; error: unknown }

  if (!user) return null

  const { data: org } = await adminClient
    .from('organizations')
    .select('bdm_threshold_amount, bdm_commission_rate')
    .eq('id', user.organization_id)
    .single() as { data: Pick<Organization, 'bdm_threshold_amount' | 'bdm_commission_rate'> | null; error: unknown }

  return {
    bdmThresholdAmount: org?.bdm_threshold_amount || 350000,
    bdmCommissionRate: org?.bdm_commission_rate || 1.0,
    isAdmin: user.role === 'admin',
  }
}

export default async function CommissionRulesPage() {
  const data = await getCommissionRules()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Commission Rules
        </h1>
        <p className="text-gray-600 mt-1">Configure how commissions are calculated for your organization</p>
      </div>

      {/* BDM Commission Rules */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">BDM Commission Settings</CardTitle>
          <CardDescription>
            Configure the threshold and commission rate for Business Development Managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommissionRulesForm
            initialThreshold={data.bdmThresholdAmount}
            initialRate={data.bdmCommissionRate}
            isAdmin={data.isAdmin}
          />
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card className="shadow-md bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">How BDM Commissions Work</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-3">
          <p>
            <strong>Monthly Threshold Model:</strong> BDMs must meet a monthly profit threshold before earning commission.
          </p>
          <ol className="list-decimal ml-4 space-y-2">
            <li>Each month, the BDM's deals contribute to their total remaining profit (after telesales commission)</li>
            <li>If they meet or exceed the threshold, they receive commission on the excess amount</li>
            <li>If they don't meet the threshold, the shortfall carries over to the next month as additional debt</li>
            <li>Commission = (Total Profit - Threshold Needed) x Commission Rate</li>
          </ol>
          <p className="mt-4">
            <strong>Example:</strong> With a threshold of 3,500 and 100% rate, if a BDM generates 5,000 in profit,
            they receive (5,000 - 3,500) x 100% = 1,500 commission.
          </p>
        </CardContent>
      </Card>

      {/* Telesales Info */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Telesales Commission</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <p>
            Telesales agents receive a fixed <strong>10% commission</strong> on the initial profit of each deal they close.
            This is calculated automatically when creating deals and paid when the deal is marked as "Paid".
          </p>
          <p className="mt-2">
            Individual telesales commission rates can be adjusted per-person in the Team settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
