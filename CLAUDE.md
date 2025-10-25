# CLAUDE.md - Development Guide for AI Assistants

This document provides comprehensive guidelines for AI assistants (like Claude) working on the LinkedIn Analytics SaaS project.

---

## Tech Stack Reference

### Core Technologies

**Frontend Framework**
- **Next.js 14.2+** with App Router
- TypeScript 5.0+ (strict mode enabled)
- React 18+ (Server Components by default)

**Styling & UI**
- **Tailwind CSS 3.4+** for styling
- **shadcn/ui** for pre-built components
- **Radix UI** (via shadcn) for accessible primitives
- **Lucide React** for icons

**Backend**
- **Next.js API Routes** (App Router)
- **Prisma ORM** for database access
- **PostgreSQL** as primary database

**Authentication**
- **NextAuth.js v5** (Auth.js)
- Email/password with bcrypt
- LinkedIn OAuth (when available)
- JWT session strategy

**Payments**
- **Stripe** for subscriptions
- Stripe Checkout for payment flow
- Stripe Customer Portal for management
- Webhook handling for events

**Email**
- **Resend** for transactional emails
- React Email for templates

**Analytics & Monitoring**
- **PostHog** for product analytics
- **Vercel Analytics** for performance
- **Sentry** (optional) for error tracking

**Data Visualization**
- **Recharts** for charts and graphs
- **React Table (TanStack Table)** for data tables

---

## Project Structure

```
linkedin-analytics-saas/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-email/
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── layout.tsx             # Dashboard layout with nav
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── billing/
│   ├── (marketing)/               # Public marketing pages
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Landing page
│   │   ├── pricing/
│   │   └── about/
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   ├── linkedin/
│   │   ├── analytics/
│   │   ├── subscription/
│   │   └── user/
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── auth/                      # Auth-specific components
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthGuard.tsx
│   ├── dashboard/                 # Dashboard components
│   │   ├── FollowerChart.tsx
│   │   ├── PostAnalyticsTable.tsx
│   │   ├── EngagementCard.tsx
│   │   ├── BestTimeHeatmap.tsx
│   │   └── DateRangeSelector.tsx
│   ├── layout/                    # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── shared/                    # Shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── auth.ts                    # Auth utilities
│   ├── db.ts                      # Prisma client singleton
│   ├── linkedin.ts                # LinkedIn API integration
│   ├── stripe.ts                  # Stripe utilities
│   ├── email.ts                   # Email sending
│   ├── analytics.ts               # Analytics calculations
│   ├── validations.ts             # Zod schemas
│   └── utils.ts                   # Shared utilities
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Migration history
│   └── seed.ts                    # Database seeding
├── types/
│   ├── index.ts                   # Shared types
│   ├── linkedin.ts                # LinkedIn data types
│   └── analytics.ts               # Analytics types
├── hooks/
│   ├── useLinkedInSync.ts
│   ├── useAnalytics.ts
│   └── useSubscription.ts
├── config/
│   ├── site.ts                    # Site configuration
│   └── pricing.ts                 # Pricing tiers
├── public/
│   ├── images/
│   └── icons/
├── .env.local                     # Local environment variables
├── .env.example                   # Example env file
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Coding Conventions

### TypeScript

**Use strict TypeScript**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}
```

**Prefer types over interfaces for data structures**
```typescript
// Good
type User = {
  id: string;
  email: string;
  name: string | null;
};

// Use interfaces for extensible objects
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Use Zod for runtime validation**
```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;
```

### React Components

**Use Server Components by default**
```typescript
// app/dashboard/page.tsx
// Server Component (default in App Router)
export default async function DashboardPage() {
  const data = await fetchData(); // Direct DB access
  return <DashboardView data={data} />;
}
```

**Mark Client Components explicitly**
```typescript
// components/dashboard/FollowerChart.tsx
'use client';

import { useState } from 'react';

export function FollowerChart({ data }: Props) {
  const [timeRange, setTimeRange] = useState('30d');
  // Client-side interactivity
}
```

**Component naming conventions**
```typescript
// Component files: PascalCase
// FollowerChart.tsx, PostAnalyticsTable.tsx

// Utility files: camelCase
// auth.ts, utils.ts, db.ts

// Types: PascalCase
// User, LinkedInPost, AnalyticsData
```

**Props typing**
```typescript
// Define props as a type
type FollowerChartProps = {
  data: FollowerSnapshot[];
  timeRange: '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: string) => void;
};

export function FollowerChart({
  data,
  timeRange,
  onTimeRangeChange
}: FollowerChartProps) {
  // Component code
}
```

### API Routes

**Standard response format**
```typescript
// lib/api-response.ts
export function successResponse<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: { message } },
    { status }
  );
}
```

**Use consistent error handling**
```typescript
// app/api/analytics/route.ts
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return errorResponse('Unauthorized', 401);
    }

    const data = await fetchAnalytics(session.user.id);
    return successResponse(data);
  } catch (error) {
    console.error('Analytics error:', error);
    return errorResponse('Failed to fetch analytics', 500);
  }
}
```

**Validate input with Zod**
```typescript
import { z } from 'zod';

const querySchema = z.object({
  timeRange: z.enum(['7d', '30d', '90d']),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params = querySchema.parse({
    timeRange: searchParams.get('timeRange'),
    limit: searchParams.get('limit'),
  });

  // Use validated params
}
```

### Database Patterns

**Use Prisma Client as singleton**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Query patterns**
```typescript
// Good: Efficient query with selected fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    linkedinProfiles: {
      select: {
        id: true,
        followerCount: true,
      },
    },
  },
});

// Bad: Fetching unnecessary data
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    linkedinProfiles: true, // Returns all fields
  },
});
```

**Use transactions for related operations**
```typescript
await prisma.$transaction(async (tx) => {
  // Update user
  await tx.user.update({
    where: { id: userId },
    data: { name: 'New Name' },
  });

  // Create audit log
  await tx.auditLog.create({
    data: {
      userId,
      action: 'UPDATE_PROFILE',
    },
  });
});
```

### File Naming

```
Components:      PascalCase.tsx     (FollowerChart.tsx)
Utilities:       camelCase.ts       (auth.ts, utils.ts)
Pages (App):     page.tsx           (app/dashboard/page.tsx)
Layouts:         layout.tsx         (app/layout.tsx)
API Routes:      route.ts           (app/api/analytics/route.ts)
Types:           camelCase.ts       (types/linkedin.ts)
Config:          camelCase.ts       (config/site.ts)
```

---

## Common Patterns

### Data Fetching (Server Components)

```typescript
// app/dashboard/page.tsx
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession();

  const [linkedinProfile, recentPosts] = await Promise.all([
    prisma.linkedinProfile.findFirst({
      where: { userId: session.user.id },
      include: { followerSnapshots: true },
    }),
    prisma.linkedinPost.findMany({
      where: {
        linkedinProfile: { userId: session.user.id },
      },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <div>
      <FollowerChart data={linkedinProfile?.followerSnapshots ?? []} />
      <RecentPosts posts={recentPosts} />
    </div>
  );
}
```

### Client-Side Data Fetching

```typescript
// hooks/useAnalytics.ts
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useAnalytics(timeRange: string) {
  const { data, error, isLoading } = useSWR(
    `/api/analytics/overview?timeRange=${timeRange}`,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    analytics: data?.data,
    isLoading,
    isError: error,
  };
}
```

### Form Handling with React Hook Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### Protected Routes

```typescript
// app/(dashboard)/layout.tsx
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Subscription Checking

```typescript
// lib/auth.ts
export async function requireSubscription(
  tier: SubscriptionTier = 'PRO'
) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
  });

  const tierHierarchy = { FREE: 0, PRO: 1, PREMIUM: 2 };
  const requiredLevel = tierHierarchy[tier];
  const userLevel = subscription
    ? tierHierarchy[subscription.tier]
    : 0;

  if (userLevel < requiredLevel) {
    throw new Error('Subscription upgrade required');
  }

  return { session, subscription };
}

// Usage in API route
export async function GET(req: Request) {
  try {
    await requireSubscription('PRO');
    // User has Pro or Premium subscription
  } catch (error) {
    return errorResponse('Upgrade to Pro required', 403);
  }
}
```

### LinkedIn Data Sync

```typescript
// app/api/linkedin/sync/route.ts
import { z } from 'zod';

const syncDataSchema = z.object({
  profile: z.object({
    linkedinId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    followerCount: z.number(),
  }),
  posts: z.array(z.object({
    id: z.string(),
    text: z.string(),
    publishedAt: z.string(),
    impressions: z.number(),
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
  })),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return errorResponse('Unauthorized', 401);
  }

  const body = await req.json();
  const data = syncDataSchema.parse(body);

  await prisma.$transaction(async (tx) => {
    // Upsert profile
    const profile = await tx.linkedinProfile.upsert({
      where: { linkedinId: data.profile.linkedinId },
      update: {
        followerCount: data.profile.followerCount,
        lastSyncedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        linkedinId: data.profile.linkedinId,
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        followerCount: data.profile.followerCount,
      },
    });

    // Create follower snapshot
    await tx.followerSnapshot.create({
      data: {
        linkedinProfileId: profile.id,
        followerCount: data.profile.followerCount,
      },
    });

    // Upsert posts
    for (const post of data.posts) {
      await tx.linkedinPost.upsert({
        where: { linkedinPostId: post.id },
        update: {
          impressions: post.impressions,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          engagementRate:
            (post.likes + post.comments + post.shares) /
            Math.max(post.impressions, 1) * 100,
        },
        create: {
          linkedinProfileId: profile.id,
          linkedinPostId: post.id,
          content: post.text,
          publishedAt: new Date(post.publishedAt),
          impressions: post.impressions,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          engagementRate:
            (post.likes + post.comments + post.shares) /
            Math.max(post.impressions, 1) * 100,
        },
      });
    }
  });

  return successResponse({ synced: true });
}
```

---

## Testing Approach

### Unit Tests (Jest)

```typescript
// __tests__/lib/analytics.test.ts
import { calculateEngagementRate } from '@/lib/analytics';

describe('Analytics calculations', () => {
  it('calculates engagement rate correctly', () => {
    const result = calculateEngagementRate({
      likes: 10,
      comments: 5,
      shares: 3,
      impressions: 100,
    });

    expect(result).toBe(18); // (10+5+3)/100 * 100 = 18%
  });

  it('handles zero impressions', () => {
    const result = calculateEngagementRate({
      likes: 10,
      comments: 5,
      shares: 3,
      impressions: 0,
    });

    expect(result).toBe(0);
  });
});
```

### Integration Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and login', async ({ page }) => {
  // Navigate to signup
  await page.goto('/signup');

  // Fill form
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');

  // Should see user email
  await expect(page.locator('text=test@example.com')).toBeVisible();
});
```

### API Route Tests

```typescript
// __tests__/api/analytics.test.ts
import { GET } from '@/app/api/analytics/overview/route';
import { NextRequest } from 'next/server';

// Mock auth
jest.mock('@/lib/auth', () => ({
  getServerSession: jest.fn(() => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
  })),
}));

describe('/api/analytics/overview', () => {
  it('returns analytics data', async () => {
    const req = new NextRequest('http://localhost/api/analytics/overview');
    const response = await GET(req);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('followerGrowth');
    expect(data.data).toHaveProperty('engagementRate');
  });
});
```

---

## Security Best Practices

### Authentication

**Always verify sessions in API routes**
```typescript
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Proceed with authenticated logic
}
```

**Hash passwords with bcrypt**
```typescript
import bcrypt from 'bcryptjs';

// Signup
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: { email, password: hashedPassword },
});

// Login
const user = await prisma.user.findUnique({ where: { email } });
const valid = await bcrypt.compare(password, user.password);
```

### Input Validation

**Always validate user input**
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// In API route
const body = await req.json();
const validated = schema.parse(body); // Throws if invalid
```

**Sanitize HTML output**
```typescript
import DOMPurify from 'isomorphic-dompurify';

// When displaying user-generated content
const clean = DOMPurify.sanitize(userInput);
```

### API Security

**Rate limiting**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

**CORS configuration**
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Only allow same origin
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_URL!);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}
```

### Environment Variables

**Never commit secrets**
```bash
# .gitignore
.env.local
.env.*.local
```

**Validate env vars at startup**
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
});

export const env = envSchema.parse(process.env);
```

### Database Security

**Use parameterized queries (Prisma does this automatically)**
```typescript
// Good: Prisma prevents SQL injection
const user = await prisma.user.findUnique({
  where: { email: userInput },
});

// Bad: Raw SQL without parameters (avoid)
await prisma.$executeRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

**Implement row-level security**
```typescript
// Always filter by userId
const posts = await prisma.linkedinPost.findMany({
  where: {
    linkedinProfile: {
      userId: session.user.id, // Important: only user's own data
    },
  },
});
```

---

## Performance Optimization

### Database

**Index frequently queried fields**
```prisma
model LinkedinPost {
  // ...

  @@index([linkedinProfileId, publishedAt])
  @@index([linkedinProfileId, engagementRate])
}
```

**Use select to limit returned fields**
```typescript
const posts = await prisma.linkedinPost.findMany({
  select: {
    id: true,
    content: true,
    publishedAt: true,
    // Only fields you need
  },
});
```

### Frontend

**Use Server Components for static content**
```typescript
// This runs on server, no JS sent to client
export default async function StaticContent() {
  const data = await fetchData();
  return <div>{data.content}</div>;
}
```

**Lazy load Client Components**
```typescript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Don't render on server
});
```

**Image optimization**
```typescript
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={100}
  height={100}
  priority={false} // Lazy load
/>
```

---

## Error Handling

### Global Error Boundary

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### API Error Handling

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// In API route
try {
  // Logic
} catch (error) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: { message: error.message, code: error.code } },
      { status: error.statusCode }
    );
  }

  // Unknown error
  console.error(error);
  return NextResponse.json(
    { success: false, error: { message: 'Internal server error' } },
    { status: 500 }
  );
}
```

---

## Logging

### Structured Logging

```typescript
// lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error';

export function log(
  level: LogLevel,
  message: string,
  meta?: Record<string, any>
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

// Usage
log('info', 'User logged in', { userId: user.id });
log('error', 'Failed to sync data', { error: error.message, userId });
```

---

## Environment-Specific Behavior

```typescript
// lib/utils.ts
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Usage
if (isDevelopment) {
  console.log('Debug info:', data);
}
```

---

## Key Principles

1. **Type Safety**: Always use TypeScript, never use `any`
2. **Validation**: Validate all user input with Zod
3. **Security**: Check authentication/authorization on every protected route
4. **Performance**: Use Server Components by default, Client only when needed
5. **Error Handling**: Always handle errors gracefully, never expose internal details
6. **Testing**: Write tests for critical business logic
7. **Logging**: Log important events and errors for debugging
8. **Documentation**: Comment complex logic, keep this guide updated

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Build
npm run build

# Database
npx prisma migrate dev          # Create and apply migration
npx prisma migrate deploy       # Apply migrations in production
npx prisma generate             # Generate Prisma Client
npx prisma studio               # Open database GUI

# Testing
npm run test                    # Run unit tests
npm run test:e2e                # Run E2E tests

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

---

## When to Ask for Human Help

1. **LinkedIn API Strategy**: If struggling with LinkedIn API access
2. **Complex Database Migrations**: Before altering production schema
3. **Security Concerns**: When unsure about security implications
4. **Architectural Decisions**: Major changes to app structure
5. **Stripe Integration Issues**: Payment processing errors
6. **Performance Problems**: Slow queries or page loads
7. **Deployment Issues**: Problems with production environment

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: 2025-10-25
**Version**: 1.0
