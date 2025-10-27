import { Card, CardContent } from '@/components/ui/card'
import { FolderKanban } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-2">
          Organize tasks into projects and track progress
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Projects Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Group related tasks, track project progress, and manage your initiatives effectively.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
