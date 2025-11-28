export const dynamic = 'force-dynamic'

import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AddTeamMemberDialog } from './add-member-dialog'
import { TeamMemberActions } from './team-member-actions'

async function getTeamData() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return { team: [], currentUser: null }

  const { data: user } = await supabase
    .from('users')
    .select('organization_id, role')
    .eq('id', session.user.id)
    .single()

  if (!user) return { team: [], currentUser: null }

  const { data: team } = await supabase
    .from('users')
    .select('*')
    .eq('organization_id', user.organization_id)
    .order('name')

  return { team: team || [], currentUser: user }
}

export default async function TeamPage() {
  const { team, currentUser } = await getTeamData()

  const canManageTeam = currentUser && ['admin', 'manager'].includes(currentUser.role)

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    telesales: 'bg-green-100 text-green-800',
    bdm: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Team
          </h1>
          <p className="text-gray-600 mt-1">Manage your team members and roles</p>
        </div>
        {canManageTeam && <AddTeamMemberDialog />}
      </div>

      {/* Team Members */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Team Members ({team.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {team.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No team members yet.</p>
              {canManageTeam && <p className="mt-2">Click "Add Team Member" to get started.</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Commission Rate</th>
                    {canManageTeam && (
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {team.map((member: any) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{member.name}</td>
                      <td className="py-3 px-4 text-gray-600">{member.email}</td>
                      <td className="py-3 px-4">
                        <Badge className={roleColors[member.role] || roleColors.telesales}>
                          {member.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {member.active ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(member.commission_rate * 100).toFixed(1)}%
                      </td>
                      {canManageTeam && (
                        <td className="py-3 px-4 text-right">
                          <TeamMemberActions member={member} />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Telesales Agent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>Receives 10% commission on initial profit from their deals when marked as paid.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">BDM (Business Development Manager)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>Receives remaining profit after telesales commission, with monthly threshold and rollover mechanism.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
