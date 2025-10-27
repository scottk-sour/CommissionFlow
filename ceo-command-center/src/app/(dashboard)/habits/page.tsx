import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Habits</h1>
        <p className="text-muted-foreground mt-2">
          Build consistency with daily habit tracking
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Habits Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Track daily habits, build streaks, and maintain momentum on your personal development.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
