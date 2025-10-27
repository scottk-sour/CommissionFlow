# CEO DAILY COMMAND CENTER - TECHNICAL PLAN

## PROJECT OVERVIEW

**Product Name:** CEO Daily Command Center
**Tagline:** Run Your Life Like a CEO Runs a Company
**One-Liner:** Transform scattered to-do lists into a strategic life operating system

### Problem Statement

Ambitious professionals struggle with:
- Scattered tasks across 5+ apps
- Starting days reactively instead of strategically
- Goals buried under urgent tasks
- No system for energy/habit tracking
- Decision fatigue from constant re-planning
- No weekly reflection to improve

### Solution

One beautiful dashboard that combines:
- Daily focus (today's #1 priority)
- Smart task management (by energy, context, priority)
- Project tracking with progress
- Goal setting with key results
- Habit tracking with streaks
- Energy audit (optimize your schedule)
- Weekly review system
- Meeting notes linked to action items

### Target User

- Entrepreneurs, founders, freelancers (28-45)
- Corporate executives, ambitious professionals
- Side hustlers juggling multiple projects
- Anyone spending 15+ mins/day planning

### Core Value Proposition

Save 2+ hours weekly on planning. Reduce decision fatigue. Strategic by design. Beautiful to use. Works on any device.

---

## TECH STACK

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + Radix UI
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **State:** React Context + useState
- **Date:** date-fns
- **Icons:** Lucide React

### Backend
- **API:** Next.js API Routes (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5
- **Payments:** Stripe (Subscriptions)
- **Email:** Resend (optional for production)

### Deployment
- **Hosting:** Vercel
- **Database:** Neon (serverless Postgres)
- **Domain:** Custom domain
- **Analytics:** Vercel Analytics
- **Monitoring:** Sentry (optional)

### Why This Stack

✅ Fast development (Next.js all-in-one)
✅ Type safety (TypeScript strict)
✅ Cost-effective ($0-20/month for 0-1000 users)
✅ Scales to 10K+ users easily
✅ Modern, maintainable
✅ Excellent DX

---

## DATABASE SCHEMA

See `prisma/schema.prisma` for the complete schema.

### Core Models

1. **User** - Authentication, subscription status, preferences
2. **Task** - Individual tasks with priority, context, energy level
3. **Project** - Group tasks, track progress, link to goals
4. **Goal** - Long-term objectives with key results
5. **Habit** - Daily/weekly habits with streak tracking
6. **HabitLog** - Daily habit completion records
7. **EnergyLog** - Track energy levels throughout the day
8. **WeeklyReview** - End-of-week reflection and planning
9. **Meeting** - Meeting notes with action items

### Key Relationships

- User has many Tasks, Projects, Goals, Habits
- Task belongs to User and optionally Project
- Project belongs to User and optionally Goal
- Habit has many HabitLogs
- All models include timestamps (createdAt, updatedAt)

---

## API ENDPOINTS

### Authentication (`/api/auth/*`)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login (handled by NextAuth)
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Users (`/api/users/*`)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

### Tasks (`/api/tasks/*`)
- `GET /api/tasks` - List all tasks (with filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get single task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/[id]/complete` - Mark complete
- `POST /api/tasks/reorder` - Update positions (drag-drop)

### Projects (`/api/projects/*`)
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project with tasks
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Goals (`/api/goals/*`)
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `GET /api/goals/[id]` - Get goal details
- `PATCH /api/goals/[id]` - Update goal (including progress)
- `DELETE /api/goals/[id]` - Delete goal

### Habits (`/api/habits/*`)
- `GET /api/habits` - List habits
- `POST /api/habits` - Create habit
- `GET /api/habits/[id]` - Get habit with logs
- `PATCH /api/habits/[id]` - Update habit
- `DELETE /api/habits/[id]` - Delete habit
- `POST /api/habits/[id]/log` - Log habit completion
- `GET /api/habits/[id]/stats` - Get streak stats

### Energy Logs (`/api/energy/*`)
- `GET /api/energy` - Get energy logs (filtered by date range)
- `POST /api/energy` - Create energy log
- `GET /api/energy/insights` - Get energy insights/patterns

### Weekly Reviews (`/api/reviews/*`)
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/[id]` - Get review details
- `PATCH /api/reviews/[id]` - Update review
- `GET /api/reviews/current-week` - Get current week stats

### Meetings (`/api/meetings/*`)
- `GET /api/meetings` - List meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/[id]` - Get meeting details
- `PATCH /api/meetings/[id]` - Update meeting
- `DELETE /api/meetings/[id]` - Delete meeting

### Dashboard (`/api/dashboard/*`)
- `GET /api/dashboard/stats` - Get dashboard overview
- `GET /api/dashboard/today` - Today's focus data
- `GET /api/dashboard/week` - This week's summary

### Stripe (`/api/stripe/*`)
- `POST /api/stripe/create-checkout` - Create checkout session
- `POST /api/stripe/create-portal` - Create customer portal
- `POST /api/stripe/webhook` - Handle Stripe webhooks

---

## FOLDER STRUCTURE

```
ceo-command-center/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   └── page.tsx
│   │   │   ├── goals/
│   │   │   │   └── page.tsx
│   │   │   ├── habits/
│   │   │   │   └── page.tsx
│   │   │   ├── energy/
│   │   │   │   └── page.tsx
│   │   │   ├── review/
│   │   │   │   └── page.tsx
│   │   │   ├── meetings/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── goals/
│   │   │   ├── habits/
│   │   │   ├── energy/
│   │   │   ├── reviews/
│   │   │   ├── meetings/
│   │   │   ├── dashboard/
│   │   │   ├── stripe/
│   │   │   └── users/
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── goals/
│   │   ├── habits/
│   │   ├── layout/
│   │   └── shared/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── stripe.ts
│   │   ├── utils.ts
│   │   └── validations/
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       └── use-*.ts
├── public/
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── PLAN.md
├── CLAUDE.md
└── README.md
```

---

## FEATURE BREAKDOWN

### Phase 1: Foundation (Day 1)
✅ Project setup
✅ Database schema
✅ Configuration files
- Authentication (signup, login)
- Basic dashboard layout
- Task CRUD

### Phase 2: Core Features (Day 2)
- Project management
- Goal tracking
- Habit tracker
- Task views (today, week, project)
- Basic charts

### Phase 3: Advanced Features (Day 3)
- Energy logging
- Weekly review system
- Meetings
- Dashboard stats
- Data visualizations

### Phase 4: Payments & Polish (Day 4)
- Stripe integration
- Free vs paid tiers
- Settings page
- Mobile responsive
- Loading states
- Error handling

### Phase 5: Deploy (Day 5)
- Vercel deployment
- Database migration
- Environment setup
- Testing
- Launch

---

## FREE VS PAID FEATURES

### Free Tier (Marketing Funnel)
- 10 tasks max
- 1 active project
- 3 habits max
- Basic dashboard
- No weekly review
- No energy tracking
- No data export

### Pro Tier ($19/month or $149/year)
- Unlimited tasks
- Unlimited projects
- Unlimited goals
- Unlimited habits
- Full dashboard with stats
- Weekly review system
- Energy audit
- Meeting notes
- Data export
- Priority support

---

## DESIGN SYSTEM

### Colors
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Gray scale: Tailwind grays

### Typography
- Font: Inter (from Google Fonts)
- Headings: font-semibold
- Body: font-normal
- Code: font-mono

### Components Style
- Rounded: rounded-lg (8px)
- Shadows: Subtle, modern
- Borders: border-gray-200
- Focus: ring-2 ring-primary

### Dashboard Layout
- Sidebar: 240px fixed (desktop)
- Main content: Fluid with max-width
- Top bar: 64px height
- Mobile: Bottom nav + hamburger menu

---

## ENVIRONMENT VARIABLES

Required variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID="price_..."

# Optional: Email (Resend)
RESEND_API_KEY="re_..."
```

---

## SUCCESS METRICS

### Technical
- Page load < 2 seconds
- Lighthouse score > 90
- Zero critical bugs
- API response < 500ms
- 99.9% uptime

### Business
- Week 1: 10 signups (validate)
- Month 1: 50 users, 10 paid ($190 MRR)
- Month 3: 150 users, 40 paid ($760 MRR)
- Month 6: 400 users, 120 paid ($2,280 MRR)
- Year 1: 1,000 users, 300 paid ($5,700 MRR)

---

## DEPLOYMENT CHECKLIST

### Pre-Deploy
- [ ] All env variables documented
- [ ] Database migrations created
- [ ] Stripe products created
- [ ] Error tracking setup

### Deploy
- [ ] Create Vercel project
- [ ] Connect GitHub repo
- [ ] Add env variables
- [ ] Deploy database (Neon)
- [ ] Run migrations
- [ ] Test Stripe webhooks

### Post-Deploy
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Test signup flow
- [ ] Test payment flow
- [ ] Monitor for errors

---

## RISKS & MITIGATION

### Technical Risks
- **Risk:** Database performance at scale
  **Mitigation:** Proper indexing, query optimization

- **Risk:** Stripe webhook failures
  **Mitigation:** Retry logic, monitoring, manual checks

- **Risk:** User data loss
  **Mitigation:** Daily backups, soft deletes

### Business Risks
- **Risk:** Low conversion (free to paid)
  **Mitigation:** Strong onboarding, clear value prop

- **Risk:** High churn
  **Mitigation:** Great UX, regular updates, community

- **Risk:** Competition (Notion, Todoist)
  **Mitigation:** Better UX, specific niche, personal touch

---

## NEXT STEPS

1. Complete Prisma schema setup
2. Install dependencies
3. Set up authentication
4. Build core features
5. Add Stripe integration
6. Polish and deploy

**Last Updated:** 2025-10-27
**Version:** 1.0
