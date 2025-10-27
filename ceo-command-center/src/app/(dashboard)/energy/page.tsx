import { Card, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export default function EnergyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Energy Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Optimize your schedule based on your energy patterns
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Zap className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Energy Tracking - Pro Feature</h2>
          <p className="text-muted-foreground max-w-md">
            Log your energy levels throughout the day and discover your optimal work patterns.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
