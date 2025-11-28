'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { DEAL_STATUS_CONFIG, DealStatus } from '@/types'

const STATUS_ORDER: DealStatus[] = ['to_do', 'done', 'signed', 'installed', 'invoiced', 'paid']

interface DealStatusUpdateProps {
  dealId: string
  currentStatus: string
}

export function DealStatusUpdate({ dealId, currentStatus }: DealStatusUpdateProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const currentIndex = STATUS_ORDER.indexOf(currentStatus as DealStatus)

  const updateStatus = async (newStatus: DealStatus) => {
    setLoading(true)

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast({
        variant: 'success',
        title: 'Status updated',
        description: `Deal moved to ${DEAL_STATUS_CONFIG[newStatus].label}`,
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update deal status',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Progress Bar */}
      <div className="flex items-center justify-between">
        {STATUS_ORDER.map((status, index) => {
          const config = DEAL_STATUS_CONFIG[status]
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={status} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center w-full">
                {/* Line before */}
                {index > 0 && (
                  <div
                    className={`absolute left-0 right-1/2 h-1 ${
                      index <= currentIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
                {/* Line after */}
                {index < STATUS_ORDER.length - 1 && (
                  <div
                    className={`absolute left-1/2 right-0 h-1 ${
                      index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
                {/* Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
              </div>
              <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                {config.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 pt-4">
        {currentIndex > 0 && STATUS_ORDER[currentIndex - 1] && (
          <Button
            variant="outline"
            onClick={() => updateStatus(STATUS_ORDER[currentIndex - 1]!)}
            disabled={loading}
          >
            Move Back to {DEAL_STATUS_CONFIG[STATUS_ORDER[currentIndex - 1]!].label}
          </Button>
        )}
        {currentIndex < STATUS_ORDER.length - 1 && STATUS_ORDER[currentIndex + 1] && (
          <Button
            onClick={() => updateStatus(STATUS_ORDER[currentIndex + 1]!)}
            disabled={loading}
          >
            {loading ? 'Updating...' : `Mark as ${DEAL_STATUS_CONFIG[STATUS_ORDER[currentIndex + 1]!].label}`}
          </Button>
        )}
        {currentStatus === 'paid' && (
          <span className="text-green-600 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Deal Complete - Commission Calculated
          </span>
        )}
      </div>
    </div>
  )
}
