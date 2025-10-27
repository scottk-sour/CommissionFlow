import { Card, CardContent } from '@/components/ui/card'
import { Target } from 'lucide-react'

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>
        <p className="text-muted-foreground mt-2">
          Set and track your quarterly and annual objectives
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Goals Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Define meaningful goals with key results and track your progress towards achieving them.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
