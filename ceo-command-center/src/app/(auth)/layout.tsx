import { Target } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-primary flex-col justify-between p-12 text-primary-foreground">
        <Link href="/" className="flex items-center gap-2">
          <Target className="h-8 w-8" />
          <span className="text-2xl font-bold">CEO Command Center</span>
        </Link>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold">
            Run your life like a CEO runs a company
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Transform scattered tasks into strategic action. Save 2+ hours weekly on planning.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary-foreground" />
            <div>
              <p className="font-semibold">Smart Task Management</p>
              <p className="text-sm text-primary-foreground/80">Organize by energy, context, and priority</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary-foreground" />
            <div>
              <p className="font-semibold">Goal Tracking with Key Results</p>
              <p className="text-sm text-primary-foreground/80">Make progress on what truly matters</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary-foreground" />
            <div>
              <p className="font-semibold">Weekly Review System</p>
              <p className="text-sm text-primary-foreground/80">Continuous improvement through reflection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
