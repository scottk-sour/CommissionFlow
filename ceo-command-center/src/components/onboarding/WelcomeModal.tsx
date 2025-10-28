'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Target, Calendar, FolderKanban, Sparkles } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type WelcomeModalProps = {
  isOpen: boolean
  onComplete: (createSampleData: boolean) => Promise<void>
}

export function WelcomeModal({ isOpen, onComplete }: WelcomeModalProps) {
  const [loading, setLoading] = useState(false)
  const [createSampleData, setCreateSampleData] = useState(true)

  const handleGetStarted = async () => {
    setLoading(true)
    try {
      await onComplete(createSampleData)
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to CEO Command Center!
          </DialogTitle>
          <DialogDescription className="text-base">
            Your strategic command center for daily excellence. Here's what you can do:
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-lg">P0-P3 Task Management</CardTitle>
              <CardDescription>
                Prioritize work by urgency and energy level. Tackle P0 critical tasks first, organize by context (Deep Work, Calls, Email, etc.)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FolderKanban className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg">Project Tracking</CardTitle>
              <CardDescription>
                Group related tasks into projects. Track progress automatically as you complete tasks. Link projects to your bigger goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle className="text-lg">Goals & Key Results</CardTitle>
              <CardDescription>
                Set quarterly and annual goals with measurable key results. Stay aligned with what matters most. Track progress over time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Habit Tracking</CardTitle>
              <CardDescription>
                Build consistency with daily habits. Track streaks, celebrate wins, and maintain momentum on your personal development.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="sample-data"
                checked={createSampleData}
                onCheckedChange={(checked) => setCreateSampleData(checked === true)}
              />
              <div className="flex-1">
                <Label htmlFor="sample-data" className="cursor-pointer font-semibold">
                  Load example data to explore features
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll create a sample project, goal, a few tasks, and a habit so you can see how everything works. You can delete them anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Tip: Start with 3-5 tasks to get a feel for the system
          </div>
          <Button onClick={handleGetStarted} disabled={loading} size="lg">
            {loading ? 'Setting up...' : "Let's Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
