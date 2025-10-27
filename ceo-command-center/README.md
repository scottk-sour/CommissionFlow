# CEO Daily Command Center

> Run Your Life Like a CEO Runs a Company

A beautiful, strategic productivity dashboard that transforms scattered tasks into a command center for ambitious professionals.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## 📸 Screenshots

*(Add screenshots of your dashboard, task view, and pricing page)*

## ✨ Features

### Free Tier
- ✅ 10 tasks with smart organization
- ✅ 1 active project
- ✅ 3 habit trackers
- ✅ 3 goal tracking
- ✅ Beautiful dashboard

### Pro Tier ($19/month or $149/year)
- 🚀 Unlimited tasks, projects, goals, habits
- 📊 Weekly review system
- ⚡ Energy audit & optimization
- 📝 Meeting notes with action items
- 📈 Advanced analytics
- 🎯 Priority support

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe Subscriptions
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or [Neon](https://neon.tech))
- Stripe account (for payments)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ceo-command-center
npm install
```

### 2. Set up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database (get from Neon or use local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ceo_command_center"

# NextAuth (generate secret: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get after setting up webhook

# Stripe Price IDs (create products in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID="price_..."
```

### 3. Set up Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes (dev)
npm run db:studio    # Open Prisma Studio
```

## 🗄 Database Schema

Key models:
- **User**: Authentication & subscription
- **Task**: Individual to-dos with context & energy
- **Project**: Group related tasks
- **Goal**: Quarterly/annual objectives with key results
- **Habit**: Daily habits with streak tracking
- **EnergyLog**: Track energy patterns
- **WeeklyReview**: Weekly reflection system
- **Meeting**: Meeting notes with action items

See `prisma/schema.prisma` for full schema.

## 🔐 Authentication Setup

The app uses NextAuth.js v5 with credentials provider:

1. Users sign up with email/password
2. Passwords hashed with bcrypt
3. JWT session strategy
4. Protected routes via middleware

## 💳 Stripe Setup

### Create Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create two products:
   - **CEO Command Center Pro - Monthly** ($19/month)
   - **CEO Command Center Pro - Yearly** ($149/year)
3. Copy the Price IDs to your `.env.local`

### Set up Webhook

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook secret to `.env.local`

Required webhook events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Database Setup

1. Create database on [Neon](https://neon.tech)
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`

### Stripe Production

1. Switch to live keys in Vercel environment variables
2. Create production webhook endpoint
3. Update `STRIPE_WEBHOOK_SECRET`

## 📝 Project Structure

```
ceo-command-center/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API routes
│   │   └── pricing/           # Public pricing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── layout/            # Layout components (Sidebar)
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── stripe.ts          # Stripe utilities
│   │   ├── subscription.ts    # Feature access control
│   │   └── validations/       # Zod schemas
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema
├── PLAN.md                    # Technical specification
├── CLAUDE.md                  # Coding conventions
└── README.md                  # This file
```

## 🎯 Feature Roadmap

### MVP (Current)
- [x] Authentication
- [x] Task management
- [x] Dashboard with stats
- [x] Subscription system
- [ ] Projects (placeholder)
- [ ] Goals (placeholder)
- [ ] Habits (placeholder)

### Phase 2
- [ ] Full Projects implementation
- [ ] Goals with key results
- [ ] Habit streak tracking
- [ ] Energy logging
- [ ] Weekly reviews

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Data export
- [ ] Team workspaces
- [ ] API for integrations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See `CLAUDE.md` for coding conventions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Stripe](https://stripe.com) - Payment processing
- [Vercel](https://vercel.com) - Hosting platform

## 📞 Support

- 📧 Email: support@ceocommandcenter.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ceo-command-center/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/ceo-command-center/discussions)

---

Built with ❤️ by ambitious professionals, for ambitious professionals.

**Start running your life like a CEO today!**
