import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">💷</span>
              <span className="ml-2 text-xl font-semibold text-gray-900">CommissionFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Commission Tracking<br />
            That <span className="text-primary">Actually Makes Sense</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop wasting hours in Excel every month. Track deals, calculate commissions automatically
            (with BDM threshold rollovers), and pay your team accurately—every time.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial →
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sound Familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">😩</div>
              <h3 className="font-semibold text-lg mb-2">Wasting 8 Hours Per Month</h3>
              <p className="text-gray-600">Calculating commissions manually in Excel spreadsheets</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="font-semibold text-lg mb-2">Commission Errors & Disputes</h3>
              <p className="text-gray-600">Wrong numbers leading to unhappy salespeople and lost trust</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">No Real-Time Visibility</h3>
              <p className="text-gray-600">Can't see who's performing until month-end reconciliation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Everything You Need
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Built specifically for UK sales teams selling physical products and installations
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon="💰"
            title="Automatic Commission Calculations"
            description="10% telesales commission calculated instantly. BDM threshold rollovers handled automatically."
          />
          <FeatureCard
            icon="📊"
            title="Deal Pipeline Tracking"
            description="Track deals from To Do → Signed → Installed → Invoiced → Paid. Know exactly where every deal stands."
          />
          <FeatureCard
            icon="🎯"
            title="BDM Threshold Rollovers"
            description="£3,500 monthly threshold with automatic shortfall carryover. We're the ONLY tool that does this properly."
          />
          <FeatureCard
            icon="📈"
            title="Real-Time Dashboard"
            description="See monthly revenue, profit, commissions due, and team performance at a glance."
          />
          <FeatureCard
            icon="📄"
            title="Monthly Reports"
            description="Generate commission reports in seconds. Export to CSV or PDF for your accountant."
          />
          <FeatureCard
            icon="👥"
            title="Team Management"
            description="Manage telesales agents and BDMs. Assign roles, set commission rates, track performance."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          No hidden fees. No per-user charges. Just one simple price for your whole team.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Starter"
            price="£49"
            features={[
              'Up to 5 users',
              '100 deals/month',
              'All core features',
              'Email support',
            ]}
          />
          <PricingCard
            name="Professional"
            price="£99"
            features={[
              'Up to 15 users',
              '500 deals/month',
              'All core features',
              'Priority support',
              'CSV export',
            ]}
            popular
          />
          <PricingCard
            name="Business"
            price="£199"
            features={[
              'Up to 50 users',
              'Unlimited deals',
              'All core features',
              'Priority support',
              'CSV & PDF export',
              'API access',
            ]}
          />
        </div>

        <p className="text-center text-gray-600 mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Stop Wasting Time on Spreadsheets?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join UK sales teams who've already saved hundreds of hours
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial →
            </Button>
          </Link>
          <p className="mt-4 text-sm opacity-75">
            Set up in 10 minutes • Free for 14 days • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-primary">💷</span>
                <span className="ml-2 text-lg font-semibold">CommissionFlow</span>
              </div>
              <p className="text-sm text-gray-600">
                Commission tracking built for UK sales teams
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/signup">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            © 2025 CommissionFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="text-4xl mb-2">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  features,
  popular = false,
}: {
  name: string
  price: string
  features: string[]
  popular?: boolean
}) {
  return (
    <Card className={popular ? 'border-primary border-2 relative' : ''}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/signup" className="mt-6 block">
          <Button className="w-full" variant={popular ? 'default' : 'outline'}>
            Start Free Trial
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
