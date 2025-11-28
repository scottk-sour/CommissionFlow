export const dynamic = 'force-dynamic'

import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe'
import { BillingActions } from './billing-actions'

async function getBillingData() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const { data: user } = await supabase
    .from('users')
    .select('organization_id, role, organization:organizations(*)')
    .eq('id', session.user.id)
    .single()

  if (!user) return null

  return {
    organization: user.organization as any,
    isAdmin: user.role === 'admin',
  }
}

export default async function BillingPage() {
  const data = await getBillingData()

  if (!data) {
    return <div>Loading...</div>
  }

  const { organization, isAdmin } = data
  const currentPlan = organization.plan || 'starter'
  const subscriptionStatus = organization.subscription_status

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-blue-100 text-blue-800',
    past_due: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Billing
        </h1>
        <p className="text-gray-600 mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Current Plan</CardTitle>
          <CardDescription>Your organization's subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{PLANS[currentPlan as keyof typeof PLANS]?.name || 'Starter'}</h3>
                {subscriptionStatus && (
                  <Badge className={statusColors[subscriptionStatus] || statusColors.active}>
                    {subscriptionStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {PLANS[currentPlan as keyof typeof PLANS]?.price || 49}/month
              </p>
            </div>
            {isAdmin && <BillingActions hasSubscription={!!organization.stripe_subscription_id} />}
          </div>

          {organization.trial_ends_at && new Date(organization.trial_ends_at) > new Date() && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Your free trial ends on{' '}
                <strong>
                  {new Date(organization.trial_ends_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {PLANS[currentPlan as keyof typeof PLANS]?.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Available Plans */}
      {isAdmin && (
        <div>
          <h2 className="text-xl font-bold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card
                key={key}
                className={`shadow-md ${currentPlan === key ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">{plan.price}</span>/month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {currentPlan === key && (
                    <div className="mt-4 text-center text-sm text-gray-500">Current Plan</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isAdmin && (
        <Card className="shadow-md">
          <CardContent className="py-6">
            <p className="text-gray-600 text-center">
              Contact your organization admin to manage billing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
