import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Bell, DollarSign, Clock, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Etsy Organizer</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-20 text-center">
        {/* Social Proof Badge */}
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
          <span className="text-muted-foreground">Built specifically for Etsy sellers</span>
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Your Etsy Shop, <span className="text-primary">Organized</span>
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            Stop juggling spreadsheets and browser tabs. Track inventory, manage orders,
            and calculate profits—all in one dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg">
              Try Free for 14 Days
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            No credit card required • Connects to Etsy in 2 minutes
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Sound Familiar?</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
            <div className="bg-background p-6 rounded-lg border">
              <p className="text-muted-foreground">
                "I ran out of stock on my bestseller and lost $500 in sales this week..."
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border">
              <p className="text-muted-foreground">
                "I spend 2 hours every day just tracking orders across multiple tabs..."
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border">
              <p className="text-muted-foreground">
                "I have no idea which products are actually profitable after Etsy fees..."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">10 hrs/week</div>
              <p className="text-muted-foreground mt-2">Average time saved</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">$39/mo</div>
              <p className="text-muted-foreground mt-2">vs $80-120 for separate tools</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">2 minutes</div>
              <p className="text-muted-foreground mt-2">To connect your Etsy shop</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Get organized in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Shop</h3>
            <p className="text-muted-foreground">
              One-click connection to your Etsy shop. We sync your products and orders automatically.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">See Everything</h3>
            <p className="text-muted-foreground">
              One dashboard with real-time inventory, orders, and profit calculations.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Stay Organized</h3>
            <p className="text-muted-foreground">
              Get alerts before you run out of stock. Track orders until delivery. Focus on selling.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-xl text-muted-foreground">
              Replace 3-4 separate tools with one simple dashboard
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <Package className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>Inventory Tracking</CardTitle>
                <CardDescription>
                  Syncs with Etsy automatically. See stock levels at a glance. Never oversell or run out unexpectedly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <Bell className="h-10 w-10 text-orange-500 mb-2" />
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Get email alerts before you run out. Set custom thresholds per product. Restock on your terms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <ShoppingCart className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  All your orders in one view. Track fulfillment status. Add tracking numbers. Stay organized.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle>Profit Calculator</CardTitle>
                <CardDescription>
                  See true profit after Etsy fees, shipping, and costs. Know which products actually make money.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-pink-500 mb-2" />
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>
                  Track revenue trends. See bestsellers. Identify what's working. Make data-driven decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <Clock className="h-10 w-10 text-yellow-500 mb-2" />
                <CardTitle>Save Hours Weekly</CardTitle>
                <CardDescription>
                  Stop switching between tabs and spreadsheets. Everything updates automatically. Focus on creating.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For Growing Etsy Shops</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-6 bg-background">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Makers & Crafters</h3>
                  <p className="text-sm text-muted-foreground">
                    Track material inventory, know your true costs, and never run out of bestselling items mid-production.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-background">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Multi-Product Shops</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage dozens or hundreds of listings easily. Bulk update stock. See which products drive profit.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-background">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Print-on-Demand</h3>
                  <p className="text-sm text-muted-foreground">
                    Sync orders automatically. Track fulfillment status. Manage customer expectations effortlessly.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-background">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Part-Time Sellers</h3>
                  <p className="text-sm text-muted-foreground">
                    Spend less time on admin, more time creating. Check your shop in minutes, not hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Is my Etsy shop data safe?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Yes! We use industry-standard OAuth to connect to Etsy (the same method Etsy recommends).
                  We never see your Etsy password, and you can revoke access anytime from your Etsy settings.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you automatically update my inventory on Etsy?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Not yet! For now, we sync data FROM Etsy to give you a better view of your shop.
                  You still update inventory on Etsy. (Two-way sync is coming soon based on seller feedback.)
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I connect multiple Etsy shops?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Yes! You can connect and manage multiple Etsy shops from one account.
                  Switch between shops easily from the dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What happens after the 14-day trial?</CardTitle>
                <CardDescription className="text-base mt-2">
                  You can upgrade to continue using Etsy Organizer for $39/month (cancel anytime).
                  Or keep using the free plan with basic inventory tracking for one shop.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How is this different from Etsy's built-in tools?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Etsy shows orders and listings separately. We bring everything together: inventory levels,
                  order status, profit calculations, and proactive alerts—all in one dashboard optimized for sellers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you offer support?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Yes! Email support for all users. We typically respond within 24 hours (usually much faster).
                  We're a small team building in public, and we read every message.
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
              Ready to Get Organized?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join Etsy sellers who've stopped juggling spreadsheets and started focusing on what matters:
              creating amazing products and growing their shops.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              14-day free trial • No credit card required • Cancel anytime
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
                <li><Link href="/signup" className="hover:text-foreground">Start Free Trial</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:support@etsyorganizer.com" className="hover:text-foreground">
                    Email Support
                  </a>
                </li>
                <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
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
              <Package className="h-5 w-5" />
              <span className="font-semibold">Etsy Organizer</span>
            </div>
            <p>© 2025 Etsy Organizer. All rights reserved.</p>
            <p className="mt-1">Built for Etsy sellers who want to stop stressing and start selling.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
