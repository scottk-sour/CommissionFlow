export const dynamic = 'force-dynamic'

import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, penceToPounds, DEAL_STATUS_CONFIG, DealStatus } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DealStatusUpdate } from './deal-status-update'
import { DealActions } from './deal-actions'

async function getDeal(id: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const { data: user } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', session.user.id)
    .single()

  if (!user) return null

  const { data: deal } = await supabase
    .from('deals')
    .select(`
      *,
      telesales_agent:users!deals_telesales_agent_id_fkey(id, name, email),
      bdm:users!deals_bdm_id_fkey(id, name, email)
    `)
    .eq('id', id)
    .eq('organization_id', user.organization_id)
    .single()

  return deal
}

export default async function DealDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const deal = await getDeal(params.id)

  if (!deal) {
    notFound()
  }

  const statusConfig = DEAL_STATUS_CONFIG[deal.status as DealStatus]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {deal.deal_number}
            </h1>
            <Badge className={statusConfig.color}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{deal.customer_name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/deals">
            <Button variant="outline">Back to Deals</Button>
          </Link>
          <DealActions dealId={deal.id} currentStatus={deal.status} />
        </div>
      </div>

      {/* Status Workflow */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Deal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <DealStatusUpdate dealId={deal.id} currentStatus={deal.status} />
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(penceToPounds(deal.deal_value))}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Initial Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(penceToPounds(deal.initial_profit))}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Telesales Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(penceToPounds(deal.telesales_commission))}</div>
            <p className="text-xs text-gray-500">10% of profit</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">BDM Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(penceToPounds(deal.remaining_profit))}</div>
            <p className="text-xs text-gray-500">After telesales</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Buy-in Cost</p>
              <p className="text-lg font-semibold">{formatCurrency(penceToPounds(deal.buy_in_cost))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Installation Cost</p>
              <p className="text-lg font-semibold">{formatCurrency(penceToPounds(deal.installation_cost))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Misc Costs</p>
              <p className="text-lg font-semibold">{formatCurrency(penceToPounds(deal.misc_costs))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Costs</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(penceToPounds(deal.buy_in_cost + deal.installation_cost + deal.misc_costs))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Assignment */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Team Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold">TS</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telesales Agent</p>
                <p className="font-semibold">{deal.telesales_agent?.name}</p>
                <p className="text-sm text-gray-500">{deal.telesales_agent?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-700 font-bold">BDM</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Business Development Manager</p>
                <p className="font-semibold">{deal.bdm?.name}</p>
                <p className="text-sm text-gray-500">{deal.bdm?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TimelineItem
              label="Created"
              date={deal.created_at}
              completed
            />
            <TimelineItem
              label="Signed"
              date={deal.month_signed}
              completed={!!deal.month_signed}
            />
            <TimelineItem
              label="Installed"
              date={deal.month_installed}
              completed={!!deal.month_installed}
            />
            <TimelineItem
              label="Invoiced"
              date={deal.month_invoiced}
              completed={!!deal.month_invoiced}
            />
            <TimelineItem
              label="Paid"
              date={deal.month_paid}
              completed={!!deal.month_paid}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {deal.notes && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{deal.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TimelineItem({
  label,
  date,
  completed,
}: {
  label: string
  date: string | null
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-3 h-3 rounded-full ${
          completed ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
      <div className="flex-1">
        <p className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
          {label}
        </p>
      </div>
      <div>
        {date ? (
          <p className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        ) : (
          <p className="text-sm text-gray-400">-</p>
        )}
      </div>
    </div>
  )
}
