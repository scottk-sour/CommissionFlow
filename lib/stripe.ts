import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - Stripe features will not work')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    price: 49,
    maxUsers: 5,
    features: [
      'Up to 5 team members',
      'Unlimited deals',
      'Commission tracking',
      'Basic reports',
    ],
  },
  professional: {
    name: 'Professional',
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '',
    price: 99,
    maxUsers: 15,
    features: [
      'Up to 15 team members',
      'Unlimited deals',
      'Advanced commission rules',
      'Custom reports',
      'Priority support',
    ],
  },
  business: {
    name: 'Business',
    priceId: process.env.STRIPE_PRICE_BUSINESS || '',
    price: 199,
    maxUsers: 50,
    features: [
      'Up to 50 team members',
      'Unlimited deals',
      'Custom integrations',
      'Dedicated support',
      'API access',
    ],
  },
} as const

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession(
  organizationId: string,
  plan: PlanType,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const planDetails = PLANS[plan]

  if (!planDetails.priceId) {
    throw new Error(`Price ID not configured for plan: ${plan}`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [
      {
        price: planDetails.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        organizationId,
        plan,
      },
    },
    metadata: {
      organizationId,
      plan,
    },
  })

  return session
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}
