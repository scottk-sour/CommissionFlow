'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface DealActionsProps {
  dealId: string
  currentStatus: string
}

export function DealActions({ dealId, currentStatus }: DealActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const canDelete = currentStatus === 'to_do' || currentStatus === 'done'

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete deal')
      }

      toast({
        variant: 'success',
        title: 'Deal deleted',
        description: 'The deal has been removed.',
      })

      router.push('/deals')
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete deal',
      })
      setLoading(false)
    }
  }

  if (!canDelete) {
    return null
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Confirm Delete'}
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={() => setShowConfirm(true)}
    >
      Delete Deal
    </Button>
  )
}
