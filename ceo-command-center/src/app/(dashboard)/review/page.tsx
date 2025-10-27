import { Card, CardContent } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weekly Review</h1>
        <p className="text-muted-foreground mt-2">
          Reflect on your week and plan strategically
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Weekly Review - Pro Feature</h2>
          <p className="text-muted-foreground max-w-md">
            Reflect on wins and learnings. Plan the week ahead strategically instead of reactively.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
