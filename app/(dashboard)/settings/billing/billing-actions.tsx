'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface BillingActionsProps {
  hasSubscription: boolean
}

export function BillingActions({ hasSubscription }: BillingActionsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleManageBilling = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to open billing portal')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: string) => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to start checkout')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
      setLoading(false)
    }
  }

  if (hasSubscription) {
    return (
      <Button onClick={handleManageBilling} disabled={loading}>
        {loading ? 'Loading...' : 'Manage Billing'}
      </Button>
    )
  }

  return (
    <Button onClick={() => handleUpgrade('starter')} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe Now'}
    </Button>
  )
}
