# LinkedIn Analytics SaaS - Comprehensive Plan

## Project Overview

A LinkedIn Analytics platform targeting solo creators and consultants (1K-50K followers) who need deeper insights than LinkedIn's native analytics provide.

**Build Timeline:** 48-72 hours
**Target Users:** Personal brand builders on LinkedIn
**Initial Scale Target:** 10,000 users
**Monthly Hosting Budget:** Under $50 initially

---

## Feature Breakdown

### MVP (Phase 1) - Days 1-3

#### 1. Authentication & User Management
- Email + password authentication via NextAuth.js
- LinkedIn OAuth integration for account connection
- User profile management
- Session management with JWT

#### 2. LinkedIn Data Collection
- OAuth flow to connect LinkedIn account
- Fetch user profile data (follower count, profile info)
- Fetch posts data (impressions, likes, comments, shares)
- Store historical data in PostgreSQL
- Background job to sync data daily

#### 3. Core Dashboard
- **Follower Growth Chart**: Line chart showing follower growth over selected time period
- **Engagement Rate**: Average engagement rate across all posts
- **Top Performing Posts**: Cards showing best 5 posts by engagement
- **Post Analytics Table**: Sortable table with all posts and their metrics
- **Best Time to Post**: Heatmap showing engagement by day/hour
- **Date Range Selector**: 7/30/90 days options

#### 4. Data Export
- Export post analytics to CSV
- Include all metrics: date, impressions, likes, comments, shares, engagement rate

#### 5. Subscription Management
- Free tier: 7-day trial, last 30 days data only
- Pro tier ($29/mo): Unlimited history, CSV export
- Stripe integration for payments
- Subscription status checking middleware

#### 6. Email Notifications
- Welcome email on signup
- LinkedIn connection confirmation
- Weekly analytics summary
- Payment receipts via Stripe

### Phase 2 (Post-MVP) - Week 2+

#### 1. Premium Features ($79/mo tier)
- Competitor tracking (track up to 5 competitors)
- AI-powered content insights using GPT-4
- Content recommendations based on top performers
- Hashtag performance analysis

#### 2. Advanced Analytics
- Content type analysis (text, image, video, document)
- Engagement velocity (how fast posts gain traction)
- Audience demographics insights
- Post scheduling recommendations

#### 3. Team Features
- Multi-account management
- Team member access controls
- White-label reports

#### 4. Integrations
- Slack notifications for milestones
- Webhook support for custom integrations
- Zapier integration

---

## Database Schema

### Users Table
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // Hashed with bcrypt
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  linkedinProfiles LinkedinProfile[]
  subscriptions Subscription[]

  @@map("users")
}
```

### Account Table (NextAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

### Session Table (NextAuth)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

### LinkedinProfile Table
```prisma
model LinkedinProfile {
  id                String   @id @default(cuid())
  userId            String
  linkedinId        String   @unique
  vanityName        String?  // LinkedIn profile URL handle
  firstName         String?
  lastName          String?
  headline          String?
  profilePicture    String?
  followerCount     Int      @default(0)
  connectionCount   Int      @default(0)
  isConnected       Boolean  @default(false)
  lastSyncedAt      DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  posts             LinkedinPost[]
  followerSnapshots FollowerSnapshot[]

  @@map("linkedin_profiles")
}
```

### LinkedinPost Table
```prisma
model LinkedinPost {
  id                String   @id @default(cuid())
  linkedinProfileId String
  linkedinPostId    String   @unique
  content           String   @db.Text
  contentType       String?  // text, image, video, document
  publishedAt       DateTime
  impressions       Int      @default(0)
  likes             Int      @default(0)
  comments          Int      @default(0)
  shares            Int      @default(0)
  engagementRate    Float    @default(0)
  clickCount        Int      @default(0)
  videoViews        Int?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  linkedinProfile   LinkedinProfile @relation(fields: [linkedinProfileId], references: [id], onDelete: Cascade)

  @@index([linkedinProfileId, publishedAt])
  @@map("linkedin_posts")
}
```

### FollowerSnapshot Table
```prisma
model FollowerSnapshot {
  id                String   @id @default(cuid())
  linkedinProfileId String
  followerCount     Int
  connectionCount   Int
  snapshotDate      DateTime @default(now())

  linkedinProfile   LinkedinProfile @relation(fields: [linkedinProfileId], references: [id], onDelete: Cascade)

  @@index([linkedinProfileId, snapshotDate])
  @@map("follower_snapshots")
}
```

### Subscription Table
```prisma
model Subscription {
  id                String   @id @default(cuid())
  userId            String
  stripeCustomerId  String?  @unique
  stripeSubscriptionId String? @unique
  stripePriceId     String?
  tier              SubscriptionTier @default(FREE)
  status            SubscriptionStatus @default(TRIAL)
  currentPeriodStart DateTime?
  currentPeriodEnd  DateTime?
  cancelAtPeriodEnd Boolean  @default(false)
  trialEndsAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

enum SubscriptionTier {
  FREE
  PRO
  PREMIUM
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  INCOMPLETE
}
```

### SyncJob Table (for background jobs)
```prisma
model SyncJob {
  id                String   @id @default(cuid())
  linkedinProfileId String
  status            SyncStatus @default(PENDING)
  startedAt         DateTime?
  completedAt       DateTime?
  error             String?  @db.Text
  postsProcessed    Int      @default(0)
  createdAt         DateTime @default(now())

  @@index([linkedinProfileId, status])
  @@map("sync_jobs")
}

enum SyncStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
```

---

## API Architecture

### API Routes Structure

```
/app/api/
  /auth/
    /[...nextauth]/route.ts      # NextAuth configuration
  /linkedin/
    /connect/route.ts            # Initialize LinkedIn OAuth
    /callback/route.ts           # LinkedIn OAuth callback
    /disconnect/route.ts         # Disconnect LinkedIn account
    /sync/route.ts               # Trigger manual sync
  /analytics/
    /overview/route.ts           # Dashboard overview data
    /posts/route.ts              # Post analytics data
    /followers/route.ts          # Follower growth data
    /best-times/route.ts         # Best posting times analysis
    /export/route.ts             # CSV export
  /subscription/
    /create-checkout/route.ts    # Create Stripe checkout session
    /portal/route.ts             # Stripe customer portal
    /webhook/route.ts            # Stripe webhook handler
  /user/
    /profile/route.ts            # Get/update user profile
```

### API Response Format

All API responses follow this format:

```typescript
// Success Response
{
  success: true,
  data: { /* response data */ }
}

// Error Response
{
  success: false,
  error: {
    message: "Error message",
    code: "ERROR_CODE"
  }
}
```

### Authentication Middleware

Protect API routes with session checking:

```typescript
// lib/auth.ts
export async function getServerSession() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

// Check subscription tier
export async function requireSubscription(tier: SubscriptionTier) {
  const session = await getServerSession();
  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id }
  });

  if (!subscription || subscription.tier < tier) {
    throw new Error('Upgrade required');
  }

  return subscription;
}
```

---

## LinkedIn API Integration Strategy

### Important Note: LinkedIn API vs Meta Graph API

**Critical Correction**: The LinkedIn API is provided by LinkedIn (Microsoft), not Meta's Graph API. Meta's Graph API is for Facebook/Instagram.

**Correct APIs to use:**
1. **LinkedIn API** (official, requires partnership application)
2. **RapidAPI LinkedIn alternatives** (third-party scrapers)
3. **Phantombuster** (LinkedIn automation tool)

### Recommended Approach for MVP

Since official LinkedIn API access requires partnership approval (can take weeks), use this strategy:

#### Option 1: Official LinkedIn API (Best for production)
- Apply for LinkedIn Partner Program
- Use Marketing Developer Platform (requires company LinkedIn page)
- APIs available:
  - Profile API
  - Share API (for posts)
  - Analytics API (company pages only)

**Limitation**: Personal profile analytics are very limited. Mainly for company pages.

#### Option 2: RapidAPI + Scraping (Faster MVP)
- Use RapidAPI's LinkedIn Profile Data API
- Scrape user's own data via browser extension
- Store data in your database
- More reliable for personal profiles

#### Option 3: Chrome Extension Approach (Recommended for MVP)
Build a lightweight Chrome extension that:
1. User installs extension
2. Extension scrapes LinkedIn analytics page
3. Sends data to your API via authenticated request
4. More reliable and doesn't violate LinkedIn ToS (user's own data)

### Implementation Strategy for MVP

**Phase 1: Chrome Extension + Manual Sync**
```
1. User signs up on web app
2. User installs Chrome extension
3. User visits LinkedIn analytics page
4. Extension extracts data and syncs to your backend
5. Web dashboard displays the data
```

**Phase 2: Apply for LinkedIn API**
While building MVP, apply for LinkedIn partnership to get official API access.

### Data Sync Architecture

```typescript
// app/api/linkedin/sync/route.ts
export async function POST(req: Request) {
  const session = await getServerSession();
  const { posts, profile } = await req.json();

  // Validate data structure
  // Store in database
  // Return success

  return NextResponse.json({ success: true });
}
```

### Data Structure from LinkedIn

```typescript
interface LinkedInPostData {
  id: string;
  text: string;
  publishedAt: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks?: number;
}

interface LinkedInProfileData {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  followerCount: number;
  connectionCount: number;
}
```

---

## Tech Stack Implementation Details

### Next.js 14 App Router Structure

```
/app/
  /layout.tsx                 # Root layout
  /page.tsx                   # Landing page
  /(auth)/
    /login/page.tsx
    /signup/page.tsx
    /verify-email/page.tsx
  /(dashboard)/
    /layout.tsx               # Dashboard layout with nav
    /dashboard/page.tsx       # Main dashboard
    /analytics/page.tsx       # Detailed analytics
    /settings/page.tsx        # User settings
    /billing/page.tsx         # Subscription management
  /api/                       # API routes (see API Architecture)

/components/
  /ui/                        # shadcn/ui components
  /dashboard/                 # Dashboard-specific components
    /FollowerChart.tsx
    /PostAnalyticsTable.tsx
    /EngagementCard.tsx
    /BestTimeHeatmap.tsx
  /auth/                      # Auth components
  /layout/                    # Layout components
    /Navbar.tsx
    /Sidebar.tsx

/lib/
  /auth.ts                    # Auth utilities
  /db.ts                      # Prisma client
  /linkedin.ts                # LinkedIn integration
  /stripe.ts                  # Stripe utilities
  /email.ts                   # Email sending (Resend)
  /analytics.ts               # Analytics calculations

/prisma/
  /schema.prisma              # Database schema
  /migrations/                # Database migrations
```

### Stripe Integration

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID!,
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_PRICE_ID!,
};

// Create checkout session
export async function createCheckoutSession(
  userId: string,
  priceId: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing?canceled=true`,
    client_reference_id: userId,
  });

  return session;
}
```

### Email with Resend

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'LinkedInsights <noreply@yourapp.com>',
    to: email,
    subject: 'Welcome to LinkedInsights!',
    html: `<p>Hi ${name}, welcome to LinkedInsights...</p>`,
  });
}
```

### PostHog Analytics

```typescript
// app/providers.tsx
'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

---

## Deployment Plan

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/linkedinsights"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

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

### Vercel Deployment Steps

1. **Initial Setup**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link project
   vercel link
   ```

2. **Database Setup (Vercel Postgres or external)**
   ```bash
   # Option A: Use Vercel Postgres (recommended)
   # Add Postgres integration in Vercel dashboard

   # Option B: Use external provider (Railway, Supabase, Neon)
   # Add DATABASE_URL to Vercel environment variables
   ```

3. **Environment Variables**
   - Add all env vars in Vercel dashboard
   - Separate production and preview environments

4. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   ```

5. **Post-Deployment**
   - Run database migrations: `npx prisma migrate deploy`
   - Test Stripe webhooks
   - Verify email sending works

### Database Migrations

```bash
# Development
npx prisma migrate dev --name init

# Production
npx prisma migrate deploy
```

### Monitoring & Alerts

- **Vercel Analytics**: Built-in performance monitoring
- **PostHog**: User behavior tracking
- **Stripe Dashboard**: Payment monitoring
- **Sentry** (optional): Error tracking

---

## Timeline Breakdown

### Day 1 (8 hours) - Foundation

**Hours 1-2: Project Setup**
- Initialize Next.js project with TypeScript
- Install dependencies (Prisma, NextAuth, Tailwind, shadcn/ui)
- Set up Git repository
- Configure environment variables

**Hours 3-4: Database & Auth**
- Create Prisma schema
- Set up PostgreSQL (local or cloud)
- Run initial migrations
- Configure NextAuth with email authentication

**Hours 5-6: UI Foundation**
- Install and configure shadcn/ui components
- Create layout components (Navbar, Sidebar)
- Build authentication pages (login, signup)
- Set up protected routes

**Hours 7-8: LinkedIn Integration Setup**
- Research LinkedIn API options
- Decide on MVP approach (extension vs API)
- Create data sync API endpoint
- Build basic profile connection flow

**End of Day 1 Deliverable**: Working auth system, database setup, basic UI

---

### Day 2 (10 hours) - Core Features

**Hours 1-3: Data Collection**
- Build LinkedIn data sync mechanism
- Create data validation logic
- Implement post data storage
- Build follower snapshot system

**Hours 4-6: Dashboard Analytics**
- Create follower growth chart (using Recharts)
- Build engagement rate calculator
- Implement top posts cards
- Create post analytics table

**Hours 7-8: Advanced Analytics**
- Build best time to post analysis
- Create heatmap visualization
- Implement date range filtering
- Add data export to CSV

**Hours 9-10: Testing & Polish**
- Test data sync flow
- Verify analytics calculations
- Fix bugs
- Improve UI/UX

**End of Day 2 Deliverable**: Fully functional analytics dashboard

---

### Day 3 (6-8 hours) - Monetization & Launch

**Hours 1-2: Stripe Integration**
- Set up Stripe account
- Create products and prices
- Build checkout flow
- Implement webhook handler

**Hours 3-4: Subscription Logic**
- Add subscription middleware
- Implement tier restrictions
- Create billing page
- Add trial period logic

**Hours 5-6: Email & Polish**
- Set up Resend
- Create email templates
- Send welcome emails
- Test entire user flow

**Hours 7-8: Deployment**
- Deploy to Vercel
- Set up production database
- Configure environment variables
- Run production migrations
- Final testing

**End of Day 3 Deliverable**: Live production app ready for users

---

### Week 2+ - Post-Launch

**Week 1 Post-Launch:**
- Monitor for bugs
- Collect user feedback
- Fix critical issues
- Add PostHog analytics

**Week 2-3:**
- Optimize performance
- Improve data sync reliability
- Enhance UI based on feedback
- Add onboarding flow

**Week 4:**
- Start Phase 2 planning
- Apply for LinkedIn API partnership
- Research competitor tracking implementation
- Plan AI insights feature

---

## Cost Breakdown (Monthly)

### Free Tier (Target: 0-1000 users)
- **Vercel Hobby**: $0 (100GB bandwidth)
- **Vercel Postgres Hobby**: $0 (256MB, 60 hours compute)
- **Resend Free**: $0 (100 emails/day)
- **PostHog Free**: $0 (1M events/month)
- **Total**: $0/month

### Growing (1000-5000 users)
- **Vercel Pro**: $20/month
- **Vercel Postgres Pro**: $0 (included, scales)
- **Resend Pro**: $20/month (50k emails/month)
- **PostHog**: $0 (still within free tier)
- **Total**: $40/month

### Scaling (5000-10000 users)
- **Vercel Pro**: $20/month
- **External Postgres** (Railway/Supabase): $5-15/month
- **Resend**: $20/month
- **PostHog**: $0-20/month
- **Total**: $45-75/month

---

## Risk Mitigation

### Technical Risks

1. **LinkedIn API Access**
   - **Risk**: Can't get official API access
   - **Mitigation**: Chrome extension approach, apply early

2. **Data Sync Reliability**
   - **Risk**: Inconsistent data syncing
   - **Mitigation**: Retry logic, job queues, error logging

3. **Database Performance**
   - **Risk**: Slow queries at scale
   - **Mitigation**: Proper indexing, query optimization, caching

4. **Stripe Webhooks**
   - **Risk**: Missed webhook events
   - **Mitigation**: Idempotency, webhook verification, retry logic

### Business Risks

1. **User Acquisition**
   - **Risk**: No one signs up
   - **Mitigation**: MVP validation, early beta users, content marketing

2. **LinkedIn ToS Violation**
   - **Risk**: LinkedIn blocks scraping
   - **Mitigation**: User's own data only, official API application

3. **Churn Rate**
   - **Risk**: High cancellation rate
   - **Mitigation**: Strong onboarding, clear value, regular updates

---

## Success Metrics

### Week 1
- [ ] 10 beta users signed up
- [ ] 5 users connected LinkedIn
- [ ] 3 users viewed analytics
- [ ] 0 critical bugs

### Month 1
- [ ] 100 total signups
- [ ] 50 active users (logged in last 7 days)
- [ ] 10 paying customers
- [ ] $290 MRR

### Month 3
- [ ] 500 total signups
- [ ] 200 active users
- [ ] 50 paying customers
- [ ] $1,450 MRR
- [ ] 20% conversion rate (trial to paid)

### Month 6
- [ ] 2,000 total signups
- [ ] 800 active users
- [ ] 200 paying customers
- [ ] $5,800 MRR
- [ ] Churn rate < 10%

---

## Next Steps

1. **Immediate (Today)**
   - Set up Next.js project
   - Initialize Git repository
   - Create Prisma schema
   - Set up local database

2. **This Week**
   - Complete MVP development
   - Deploy to Vercel
   - Set up Stripe
   - Get 5 beta testers

3. **This Month**
   - Apply for LinkedIn API
   - Launch on Product Hunt
   - Create content marketing plan
   - Reach 100 signups

4. **Next 3 Months**
   - Iterate based on feedback
   - Add premium features
   - Scale to 500 users
   - Plan Phase 2 features
