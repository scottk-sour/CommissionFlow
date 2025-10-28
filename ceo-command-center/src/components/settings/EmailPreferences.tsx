'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type EmailPreferencesProps = {
  initialEnabled: boolean
  initialTime: string
  initialTimezone: string
}

export function EmailPreferences({
  initialEnabled,
  initialTime,
  initialTimezone,
}: EmailPreferencesProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [time, setTime] = useState(initialTime)
  const [timezone, setTimezone] = useState(initialTimezone)
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const hasChanges = enabled !== initialEnabled || time !== initialTime || timezone !== initialTimezone

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/user/email-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailDigestEnabled: enabled,
          emailDigestTime: time,
          emailDigestTimezone: timezone,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email preferences saved!' })
        // Refresh the page to update initial values
        window.location.reload()
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to save preferences' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendTest = async () => {
    setIsSendingTest(true)
    setMessage(null)

    try {
      const response = await fetch('/api/email/daily-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Test email sent! Check your inbox.' })
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to send test email' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test email' })
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Configure your daily digest email with tasks, habits, and progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Daily Digest Email</Label>
            <div className="text-sm text-muted-foreground">
              Receive a morning summary of your tasks, habits, and progress
            </div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              enabled ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <>
            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="digest-time">Preferred Time</Label>
              <Input
                id="digest-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="max-w-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                Choose when you'd like to receive your daily digest
              </p>
            </div>

            {/* Timezone Info */}
            <div className="space-y-2">
              <Label>Timezone</Label>
              <p className="text-sm text-muted-foreground">
                Your timezone: {timezone}
              </p>
              <p className="text-xs text-muted-foreground">
                Timezone detection is automatic based on your browser settings
              </p>
            </div>

            {/* What's Included */}
            <div className="space-y-2">
              <Label>What's Included</Label>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li className="list-disc">P0/P1 tasks due today (max 5)</li>
                <li className="list-disc">Overdue tasks</li>
                <li className="list-disc">Today's habits</li>
                <li className="list-disc">Quick stats: streaks, completion rate, active projects</li>
              </ul>
            </div>

            {/* Test Email Button */}
            <div>
              <Button
                variant="outline"
                onClick={handleSendTest}
                disabled={isSendingTest}
              >
                {isSendingTest ? 'Sending...' : 'Send Test Email'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Preview what your daily digest will look like
              </p>
            </div>
          </>
        )}

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
