import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meetings</h1>
        <p className="text-muted-foreground mt-2">
          Capture meeting notes and action items
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Meetings - Pro Feature</h2>
          <p className="text-muted-foreground max-w-md">
            Keep track of meeting notes, decisions, and action items all in one place.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
