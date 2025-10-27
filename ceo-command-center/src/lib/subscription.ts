import { SubscriptionStatus } from '@prisma/client'
import { prisma } from './prisma'

export function isPro(subscriptionStatus: SubscriptionStatus): boolean {
  return subscriptionStatus === 'ACTIVE' || subscriptionStatus === 'TRIALING'
}

export async function checkFeatureAccess(
  userId: string,
  feature: 'tasks' | 'projects' | 'habits' | 'goals' | 'energy' | 'review' | 'meetings'
): Promise<{ allowed: boolean; reason?: string; limit?: number; current?: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true },
  })

  if (!user) {
    return { allowed: false, reason: 'User not found' }
  }

  // Pro users have access to everything
  if (isPro(user.subscriptionStatus)) {
    return { allowed: true }
  }

  // Free tier feature restrictions
  if (feature === 'energy' || feature === 'review') {
    return {
      allowed: false,
      reason: 'This feature requires Pro. Upgrade to unlock.',
    }
  }

  // Free tier limits
  if (feature === 'tasks') {
    const count = await prisma.task.count({
      where: { userId, status: { not: 'CANCELED' } },
    })
    if (count >= 10) {
      return {
        allowed: false,
        reason: 'Free tier limited to 10 tasks. Upgrade to Pro for unlimited.',
        limit: 10,
        current: count,
      }
    }
    return { allowed: true, limit: 10, current: count }
  }

  if (feature === 'projects') {
    const count = await prisma.project.count({
      where: { userId, status: 'ACTIVE' },
    })
    if (count >= 1) {
      return {
        allowed: false,
        reason: 'Free tier limited to 1 active project. Upgrade to Pro for unlimited.',
        limit: 1,
        current: count,
      }
    }
    return { allowed: true, limit: 1, current: count }
  }

  if (feature === 'habits') {
    const count = await prisma.habit.count({
      where: { userId, active: true },
    })
    if (count >= 3) {
      return {
        allowed: false,
        reason: 'Free tier limited to 3 habits. Upgrade to Pro for unlimited.',
        limit: 3,
        current: count,
      }
    }
    return { allowed: true, limit: 3, current: count }
  }

  if (feature === 'goals') {
    const count = await prisma.goal.count({
      where: { userId, status: { not: 'ABANDONED' } },
    })
    if (count >= 3) {
      return {
        allowed: false,
        reason: 'Free tier limited to 3 goals. Upgrade to Pro for unlimited.',
        limit: 3,
        current: count,
      }
    }
    return { allowed: true, limit: 3, current: count }
  }

  if (feature === 'meetings') {
    return {
      allowed: false,
      reason: 'Meeting notes require Pro. Upgrade to unlock.',
    }
  }

  return { allowed: true }
}

export const PRICING = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '10 tasks',
      '1 active project',
      '3 habits',
      '3 goals',
      'Basic dashboard',
    ],
  },
  MONTHLY: {
    name: 'Pro Monthly',
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    features: [
      'Unlimited tasks',
      'Unlimited projects',
      'Unlimited habits',
      'Unlimited goals',
      'Full dashboard with stats',
      'Weekly review system',
      'Energy audit',
      'Meeting notes',
      'Data export',
      'Priority support',
    ],
  },
  YEARLY: {
    name: 'Pro Yearly',
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
    savings: 79, // $228 - $149
    features: [
      'Everything in Monthly',
      'Save $79/year (34% off)',
      '2 months free',
    ],
  },
}
