import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, BarChart3, Target, Calendar, Zap, TrendingUp, ArrowRight } from "lucide-react"

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
              <Button size="lg">Get Started Free</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-20 text-center">
        {/* Social Proof Badge */}
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
          <span className="text-muted-foreground">Join productive CEOs and founders</span>
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Run Your Life Like a <span className="text-primary">CEO</span> Runs a Company
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            Stop drowning in to-do lists. Start running your life like a business with a strategic command center
            built for ambitious professionals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg">
              Start Free Forever
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Free forever • No credit card • 2-minute setup
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/50 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">2+ hours</div>
              <p className="text-muted-foreground mt-1">Saved weekly on planning</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4 systems</div>
              <p className="text-muted-foreground mt-1">Tasks, Projects, Goals, Habits</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100% free</div>
              <p className="text-muted-foreground mt-1">Core features, always free</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Get started in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign up free</h3>
            <p className="text-muted-foreground">
              Create your account in 30 seconds. No credit card required.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">See your command center</h3>
            <p className="text-muted-foreground">
              We'll show you around with optional sample data to explore features.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Start managing</h3>
            <p className="text-muted-foreground">
              Add your tasks, projects, and goals. Start making real progress.
            </p>
          </div>
        </div>
      </section>

      {/* Screenshot Section 1 - Tasks */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Prioritize What Actually Matters
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Not all tasks are created equal. Use P0-P3 prioritization, energy level matching,
                and context filtering to tackle the right work at the right time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>P0 Critical → P3 Low priority system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Match tasks to your energy level (High, Medium, Low)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Filter by context: Deep Work, Calls, Email, Admin</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full aspect-video bg-muted rounded-lg border-2 flex items-center justify-center">
                <p className="text-muted-foreground">Task Board Screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Section 2 - Projects */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1 flex items-center justify-center">
              <div className="w-full aspect-video bg-muted rounded-lg border-2 flex items-center justify-center">
                <p className="text-muted-foreground">Projects Dashboard Screenshot</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">
                Track Projects Like a Pro
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Group related tasks into projects. See progress automatically calculated.
                Link projects to your bigger goals for strategic alignment.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Automatic progress tracking based on completed tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Color-coded cards for quick visual scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Link to quarterly and annual goals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Section 3 - Habits */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Build Habits That Stick
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Track daily habits with a beautiful visual calendar. See your streaks grow.
                Celebrate consistency. Build the foundation for long-term success.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Visual 7-day calendar shows your progress at a glance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Automatic streak tracking keeps you motivated</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Connect habits to your 'why' for deeper motivation</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full aspect-video bg-muted rounded-lg border-2 flex items-center justify-center">
                <p className="text-muted-foreground">Habits Tracker Screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Stay on Track</h2>
          <p className="text-xl text-muted-foreground">
            Four powerful systems that work together seamlessly
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle>Smart Task Management</CardTitle>
              <CardDescription>
                Stop context switching. Organize by energy, priority, and context so you always know
                what to work on next.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Target className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Goal Tracking with OKRs</CardTitle>
              <CardDescription>
                Set quarterly and annual goals with measurable key results. Ensure your daily work
                ladders up to what matters.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Calendar className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Habit Tracking</CardTitle>
              <CardDescription>
                Build the daily routines that compound into massive results. Track streaks and stay consistent.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-500 mb-2" />
              <CardTitle>Energy Audit</CardTitle>
              <CardDescription>
                Discover your peak performance hours. Schedule deep work when you're at your best,
                admin when you're not.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Weekly Reviews</CardTitle>
              <CardDescription>
                Reflect, adjust, plan ahead. Stop being reactive and start being strategic about your time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-pink-500 mb-2" />
              <CardTitle>Project Dashboard</CardTitle>
              <CardDescription>
                See all your projects at a glance. Nothing falls through the cracks when everything is visible.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Is it really free?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Yes! All core features (Tasks, Projects, Goals, Habits) are 100% free forever.
                  We'll add premium features later (like team collaboration), but the personal
                  productivity suite will always be free.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do I need a credit card to sign up?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Nope! Just your email and a password. Start using the full app immediately.
                  No trials, no upsells, no tricks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How is this different from Notion, Todoist, or Asana?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Those tools are either too generic (Notion) or too focused on one thing (Todoist = tasks only).
                  CEO Command Center is purpose-built for personal productivity with Tasks, Projects, Goals, and
                  Habits working together. It's like having a COO managing your life.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I import my tasks from other apps?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Not yet, but it's on the roadmap! For now, we recommend loading sample data when you sign up
                  to see how the system works, then adding your real tasks. Most people finish migration in under 30 minutes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I get help if I'm stuck?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Email us at support@ceocommandcenter.com - we typically respond within 24 hours.
                  We're a small team building in public and we read every message.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I cancel anytime?</CardTitle>
                <CardDescription className="text-base mt-2">
                  The free version has no contract - use it as long as you want. When we launch premium features,
                  those will also be cancel-anytime with one click.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-24">
        <Card className="border-2 border-primary max-w-4xl mx-auto">
          <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
            <h2 className="text-4xl font-bold">
              Ready to Run Your Life Like a Business?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join ambitious professionals who've stopped drowning in to-do lists and started
              making real progress on what matters. Setup takes 2 minutes.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg">
                Start Free Forever
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free forever • No credit card required • Full access to all features
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-foreground">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:support@ceocommandcenter.com" className="hover:text-foreground">
                    Email Support
                  </a>
                </li>
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5" />
              <span className="font-semibold">CEO Command Center</span>
            </div>
            <p>© 2025 CEO Command Center. All rights reserved.</p>
            <p className="mt-1">Built for ambitious professionals who want to do more with their time.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
