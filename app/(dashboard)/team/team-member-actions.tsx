'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

interface TeamMemberActionsProps {
  member: {
    id: string
    name: string
    email: string
    role: string
    commission_rate: number
    active: boolean
  }
}

export function TeamMemberActions({ member }: TeamMemberActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: member.name,
    role: member.role,
    commissionRate: (member.commission_rate * 100).toString(),
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          commissionRate: parseFloat(formData.commissionRate) / 100,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update team member')
      }

      toast({
        variant: 'success',
        title: 'Team member updated',
        description: `${formData.name}'s details have been updated.`,
      })

      setShowEdit(false)
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

  const toggleActive = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: !member.active,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status')
      }

      toast({
        variant: 'success',
        title: 'Status updated',
        description: `${member.name} is now ${member.active ? 'inactive' : 'active'}.`,
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

  if (showEdit) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Team Member</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" value={member.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="telesales">Telesales Agent</option>
                  <option value="bdm">BDM</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEdit(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} disabled={loading}>
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleActive}
        disabled={loading}
        className={member.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
      >
        {member.active ? 'Deactivate' : 'Activate'}
      </Button>
    </div>
  )
}
