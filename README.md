# LinkedIn Analytics SaaS

A powerful analytics platform for LinkedIn creators and consultants who want deeper insights than LinkedIn's native analytics provide.

**Target Users**: Solo creators and consultants building personal brands on LinkedIn (1K-50K followers)

**Live Demo**: Coming soon
**Documentation**: See [PLAN.md](./PLAN.md) for detailed project plan

---

## Features

### MVP (Phase 1)

- **LinkedIn Account Connection**: Secure OAuth integration
- **Comprehensive Dashboard**:
  - Follower growth tracking over time
  - Engagement rate analysis by post
  - Top performing posts showcase
  - Detailed post analytics table
  - Best time to post recommendations
- **Data Export**: Export analytics to CSV
- **Flexible Time Ranges**: View data for 7, 30, or 90 days
- **Subscription Tiers**: Free trial, Pro ($29/mo), Premium ($79/mo)

### Coming Soon (Phase 2)

- Competitor tracking
- AI-powered content insights
- Content recommendations
- Hashtag performance analysis
- Advanced audience demographics

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (Email + LinkedIn OAuth)
- **Payments**: Stripe
- **Email**: Resend
- **Analytics**: PostHog
- **Hosting**: Vercel

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and coding conventions.

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/linkedin-analytics-saas.git
   cd linkedin-analytics-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   ```bash
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/linkedinsights"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="" # Generate with: openssl rand -base64 32

   # LinkedIn OAuth (when available)
   LINKEDIN_CLIENT_ID=""
   LINKEDIN_CLIENT_SECRET=""

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_PRO_PRICE_ID="price_..."
   STRIPE_PREMIUM_PRICE_ID="price_..."

   # Resend
   RESEND_API_KEY="re_..."

   # PostHog
   NEXT_PUBLIC_POSTHOG_KEY="phc_..."
   NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

   # App
   NEXT_PUBLIC_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed database with test data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Workflow

### Project Structure

```
linkedin-analytics-saas/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── auth/             # Auth components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

### Common Tasks

#### Database Operations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_change

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

#### Running Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run all tests with coverage
npm run test:coverage
```

#### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code with Prettier
npm run format
```

#### Building for Production

```bash
# Build the application
npm run build

# Start production server locally
npm run start
```

---

## Database Schema

### Core Tables

- **users**: User accounts and authentication
- **accounts**: OAuth provider accounts (NextAuth)
- **sessions**: User sessions (NextAuth)
- **linkedin_profiles**: Connected LinkedIn profiles
- **linkedin_posts**: Post data and analytics
- **follower_snapshots**: Historical follower count data
- **subscriptions**: Stripe subscription management
- **sync_jobs**: Background job tracking

See [PLAN.md](./PLAN.md) for complete schema definitions.

---

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user

### LinkedIn
- `GET /api/linkedin/connect` - Initialize LinkedIn OAuth
- `POST /api/linkedin/sync` - Sync LinkedIn data
- `POST /api/linkedin/disconnect` - Disconnect LinkedIn account

### Analytics
- `GET /api/analytics/overview` - Dashboard overview data
- `GET /api/analytics/posts` - Post analytics data
- `GET /api/analytics/followers` - Follower growth data
- `GET /api/analytics/best-times` - Best posting times
- `GET /api/analytics/export` - Export data to CSV

### Subscription
- `POST /api/subscription/create-checkout` - Create Stripe checkout session
- `GET /api/subscription/portal` - Open Stripe customer portal
- `POST /api/subscription/webhook` - Handle Stripe webhooks

---

## Environment Setup

### Local Development

1. **PostgreSQL**: Install locally or use Docker
   ```bash
   # Using Docker
   docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

   # Connection string
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linkedinsights"
   ```

2. **Stripe CLI** (for webhook testing)
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/subscription/webhook
   ```

3. **Resend**: Sign up at [resend.com](https://resend.com) and get API key

4. **PostHog**: Sign up at [posthog.com](https://posthog.com) for free analytics

### Production Deployment (Vercel)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository in Vercel dashboard
   - Add environment variables
   - Deploy

3. **Set up PostgreSQL**
   - Option A: Use Vercel Postgres (recommended)
   - Option B: Use external provider (Supabase, Railway, Neon)

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Configure Stripe webhook**
   - Add production webhook endpoint in Stripe dashboard
   - URL: `https://yourapp.com/api/subscription/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`

---

## Configuration

### Stripe Products Setup

Create these products in your Stripe dashboard:

1. **Pro Plan**
   - Price: $29/month
   - Features: Unlimited history, CSV export
   - Copy the Price ID to `STRIPE_PRO_PRICE_ID`

2. **Premium Plan**
   - Price: $79/month
   - Features: Everything in Pro + Competitor tracking + AI insights
   - Copy the Price ID to `STRIPE_PREMIUM_PRICE_ID`

### Resend Email Setup

1. Add your domain in Resend dashboard
2. Verify DNS records
3. Create API key
4. Update `RESEND_API_KEY` in environment variables

### PostHog Setup

1. Create account at posthog.com
2. Create new project
3. Copy Project API Key to `NEXT_PUBLIC_POSTHOG_KEY`

---

## LinkedIn Integration

### Current Approach (MVP)

Since official LinkedIn API access requires partnership approval, the MVP uses a Chrome extension approach:

1. User signs up on the web app
2. User installs Chrome extension (to be built)
3. User visits LinkedIn analytics page
4. Extension extracts data and syncs to backend via API
5. Dashboard displays the data

### Future Approach (Official API)

Apply for LinkedIn Partnership to access:
- Profile API
- Share API
- Analytics API (limited for personal profiles)

See [PLAN.md](./PLAN.md) for detailed LinkedIn API integration strategy.

---

## Troubleshooting

### Common Issues

**Database connection errors**
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

**Prisma Client errors**
```bash
# Regenerate Prisma Client
npx prisma generate
```

**NextAuth session issues**
```bash
# Clear browser cookies
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches your app URL
```

**Stripe webhook failures**
```bash
# Verify webhook secret matches
# Check webhook endpoint is accessible
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/subscription/webhook
```

---

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test -- analytics.test.ts

# Run with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- auth.spec.ts
```

### Manual Testing

1. **Auth Flow**: Sign up → Verify email → Login
2. **LinkedIn Connection**: Connect account → Sync data → View dashboard
3. **Subscription**: Start trial → Upgrade to Pro → Cancel subscription
4. **Analytics**: View charts → Export CSV → Change date range

---

## Performance

### Optimization Checklist

- [ ] Database indexes on frequently queried fields
- [ ] Use Server Components where possible
- [ ] Lazy load Client Components
- [ ] Optimize images with Next.js Image component
- [ ] Enable response caching for API routes
- [ ] Monitor Core Web Vitals with Vercel Analytics

### Monitoring

- **Vercel Analytics**: Page load performance
- **PostHog**: User behavior and funnels
- **Prisma**: Query performance logs
- **Sentry** (optional): Error tracking and alerts

---

## Security

### Best Practices

- All passwords hashed with bcrypt (10 rounds)
- HTTPS enforced in production
- CORS configured for same-origin only
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection with React's built-in escaping
- CSRF protection via NextAuth
- Rate limiting on API routes (recommended)
- Environment variables never committed

### Security Checklist

- [ ] All API routes check authentication
- [ ] User input validated with Zod
- [ ] Passwords hashed with bcrypt
- [ ] HTTPS enabled in production
- [ ] Environment secrets not in Git
- [ ] Database queries parameterized (Prisma)
- [ ] Rate limiting implemented
- [ ] Security headers configured

---

## Contributing

This is a solo project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Roadmap

### Phase 1 (MVP) - Weeks 1-2
- [x] Project setup
- [ ] Authentication system
- [ ] LinkedIn data sync
- [ ] Analytics dashboard
- [ ] Stripe integration
- [ ] Email notifications
- [ ] Production deployment

### Phase 2 - Month 2
- [ ] Competitor tracking
- [ ] AI-powered insights
- [ ] Content recommendations
- [ ] Advanced analytics

### Phase 3 - Month 3
- [ ] Team features
- [ ] White-label reports
- [ ] API webhooks
- [ ] Mobile app (maybe)

---

## License

This project is proprietary. All rights reserved.

---

## Support

- **Documentation**: See [PLAN.md](./PLAN.md) and [CLAUDE.md](./CLAUDE.md)
- **Issues**: Open an issue on GitHub
- **Email**: support@yourapp.com

---

## Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Stripe](https://stripe.com) - Payment processing
- [Vercel](https://vercel.com) - Hosting platform

---

**Built with Next.js 14, TypeScript, and PostgreSQL**

Last updated: 2025-10-25
