import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, BarChart3, Target, Calendar, Zap, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CEO Command Center</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-24 text-center">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Run Your Life Like a <span className="text-primary">CEO</span> Runs a Company
          </h1>
          <p className="text-xl text-muted-foreground">
            Transform scattered to-do lists into a strategic life operating system.
            Save 2+ hours weekly on planning. Make progress on what actually matters.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8">
              Start Free Trial
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="h-12 px-8">
              See Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Task Management</CardTitle>
              <CardDescription>
                Organize by energy level, context, and priority. Start each day knowing exactly what to focus on.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>
                Set quarterly and annual goals with key results. Track progress and ensure urgent tasks don't bury important ones.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Habit Tracking</CardTitle>
              <CardDescription>
                Build consistent habits with streak tracking. See what's working and maintain momentum.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Energy Audit</CardTitle>
              <CardDescription>
                Track your energy throughout the day. Schedule deep work when you're at your best.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Weekly Reviews</CardTitle>
              <CardDescription>
                Reflect on wins and learnings. Plan the week ahead strategically instead of reactively.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Project Dashboard</CardTitle>
              <CardDescription>
                See all your projects at a glance. Track progress and ensure nothing falls through the cracks.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="border-2 border-primary">
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <CardTitle className="text-3xl">
              Ready to transform your productivity?
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl">
              Join ambitious professionals who've taken control of their time.
              Start with our free tier, upgrade when you're ready.
            </CardDescription>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8">
                Get Started Free
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              No credit card required • Upgrade anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 CEO Command Center. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:underline">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
