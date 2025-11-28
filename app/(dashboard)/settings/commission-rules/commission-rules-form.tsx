'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

interface CommissionRulesFormProps {
  initialThreshold: number // in pence
  initialRate: number // decimal 0-1
  isAdmin: boolean
}

export function CommissionRulesForm({ initialThreshold, initialRate, isAdmin }: CommissionRulesFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    thresholdPounds: (initialThreshold / 100).toFixed(2),
    ratePercent: (initialRate * 100).toFixed(0),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const thresholdPence = Math.round(parseFloat(formData.thresholdPounds) * 100)
      const rateDecimal = parseFloat(formData.ratePercent) / 100

      const response = await fetch('/api/settings/commission-rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bdmThresholdAmount: thresholdPence,
          bdmCommissionRate: rateDecimal,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update commission rules')
      }

      toast({
        variant: 'success',
        title: 'Commission rules updated',
        description: 'Your commission settings have been saved.',
      })

      router.refresh()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-500">Monthly Threshold</Label>
            <p className="text-2xl font-bold mt-1">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(initialThreshold / 100)}
            </p>
            <p className="text-sm text-gray-500 mt-1">BDMs must generate this much profit before earning commission</p>
          </div>
          <div>
            <Label className="text-gray-500">Commission Rate</Label>
            <p className="text-2xl font-bold mt-1">{(initialRate * 100).toFixed(0)}%</p>
            <p className="text-sm text-gray-500 mt-1">Percentage of excess profit paid as commission</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-100 rounded">
          Only admins can modify commission rules. Contact your organization admin to make changes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="threshold">Monthly Threshold (GBP)</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">GBP</span>
            <Input
              id="threshold"
              type="number"
              step="0.01"
              min="0"
              value={formData.thresholdPounds}
              onChange={(e) => setFormData({ ...formData, thresholdPounds: e.target.value })}
              className="pl-12"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            BDMs must generate this much profit before earning commission
          </p>
        </div>

        <div>
          <Label htmlFor="rate">Commission Rate (%)</Label>
          <div className="relative mt-1">
            <Input
              id="rate"
              type="number"
              step="1"
              min="0"
              max="100"
              value={formData.ratePercent}
              onChange={(e) => setFormData({ ...formData, ratePercent: e.target.value })}
              disabled={loading}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Percentage of excess profit paid as BDM commission
          </p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Commission Rules'}
        </Button>
      </div>
    </form>
  )
}
