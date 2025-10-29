import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Package } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Etsy Organizer</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect to get started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/signup" className="block">
                <Button className="w-full" variant="outline">Get Started</Button>
              </Link>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">10 tasks</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">1 active project</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">3 habits</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">3 goals</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Basic dashboard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Pro */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full mb-2">
                POPULAR
              </div>
              <CardTitle>Pro Monthly</CardTitle>
              <CardDescription>For growing Etsy shops</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/signup" className="block">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Everything in Free, plus:</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited tasks</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited goals & habits</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Weekly review system</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Energy audit</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Meeting notes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Pro */}
          <Card>
            <CardHeader>
              <div className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full mb-2">
                BEST VALUE
              </div>
              <CardTitle>Pro Yearly</CardTitle>
              <CardDescription>Save 34% annually</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-green-600 font-medium">Save $79/year</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/signup" className="block">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Everything in Pro Monthly</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">2 months free</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">34% savings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Etsy Organizer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
