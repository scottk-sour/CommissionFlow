# LinkedIn Analytics SaaS - Production Deployment Guide

This guide will walk you through deploying the LinkedIn Analytics SaaS application to production.

---

## 🎯 Deployment Overview

**Platform**: Vercel (recommended)
**Database**: Vercel Postgres or external PostgreSQL
**Domain**: Your custom domain or Vercel subdomain
**Estimated Time**: 30-45 minutes

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Vercel account (free tier works for MVP)
- [ ] GitHub repository with the code
- [ ] Stripe account (with test/production keys)
- [ ] Resend account (for email) - optional for initial deployment
- [ ] PostHog account (for analytics) - optional for initial deployment

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare the Repository

The application code is currently in `/home/user/Scott-Davies/linkedin-analytics-saas/`. You need to push this to GitHub.

**Option A: Create a new repository**

```bash
cd /home/user/Scott-Davies/linkedin-analytics-saas

# If git is not initialized, initialize it
git init
git add .
git commit -m "Initial commit - LinkedIn Analytics SaaS MVP"

# Create a new repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/linkedin-analytics-saas.git
git branch -M main
git push -u origin main
```

**Option B: Use the existing repository**

The application is already in a subdirectory. You can either:
- Keep it as a monorepo (current structure)
- Extract it to its own repository (recommended)

---

### Step 2: Set Up Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up or log in with your GitHub account

2. **Import the project**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure the project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or `linkedin-analytics-saas/` if using monorepo)
   - **Build Command**: Leave default (`next build`)
   - **Install Command**: Leave default (`npm install`)

---

### Step 3: Set Up the Database

You have two options for the database:

#### Option A: Vercel Postgres (Recommended - Easiest)

1. **In Vercel dashboard:**
   - Go to your project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose the region closest to your users
   - Create the database

2. **Vercel will automatically:**
   - Add `DATABASE_URL` to your environment variables
   - Add `POSTGRES_*` variables

3. **Note the connection string** for later use

#### Option B: External PostgreSQL (Neon, Supabase, Railway)

**Using Neon (Recommended - Free tier available):**

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Name it "linkedin-analytics-saas"
4. Select region
5. Copy the connection string

**Using Supabase:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Direct connection)

**Using Railway:**

1. Go to [railway.app](https://railway.app)
2. Create new project → PostgreSQL
3. Copy the connection string

---

### Step 4: Configure Environment Variables in Vercel

1. **In Vercel project settings:**
   - Go to "Settings" → "Environment Variables"

2. **Add the following variables:**

```bash
# Database (if not using Vercel Postgres)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth.js
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate-with-command-below>

# Stripe (Start with test keys, switch to production when ready)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Optional (can add later)
RESEND_API_KEY=re_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and use it as `NEXTAUTH_SECRET`

4. **For each variable:**
   - Click "Add New"
   - Enter Name and Value
   - Select environments: Production, Preview, Development
   - Click "Save"

---

### Step 5: Set Up Stripe

1. **Create Stripe account** at [stripe.com](https://stripe.com)

2. **Get API Keys:**
   - Go to Developers → API Keys
   - Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → `STRIPE_SECRET_KEY`

3. **Create Products:**
   - Go to Products → Add Product

   **Pro Plan:**
   - Name: "Pro Plan"
   - Price: $29/month
   - Recurring
   - Copy Price ID → `STRIPE_PRO_PRICE_ID`

   **Premium Plan:**
   - Name: "Premium Plan"
   - Price: $79/month
   - Recurring
   - Copy Price ID → `STRIPE_PREMIUM_PRICE_ID`

4. **Set up webhook** (after first deployment):
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-app.vercel.app/api/subscription/webhook`
   - Events: Select these events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET`
   - Update in Vercel environment variables

---

### Step 6: Run Database Migrations

After the first deployment, you need to run Prisma migrations:

**Method 1: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migration in production
vercel env pull .env.production
npx prisma migrate deploy
```

**Method 2: Using Prisma Data Platform**

```bash
# From your local machine with production DATABASE_URL
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

**Method 3: Add to package.json postbuild (Automatic)**

Add to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Then redeploy from Vercel dashboard.

---

### Step 7: Deploy!

1. **Trigger deployment:**
   - Push to main branch, or
   - Click "Redeploy" in Vercel dashboard

2. **Monitor the build:**
   - Watch the deployment logs in Vercel
   - Build should take 2-3 minutes

3. **Check for errors:**
   - Look for any build errors
   - Check function logs

---

### Step 8: Post-Deployment Verification

1. **Test the application:**
   - Visit your deployed URL
   - Create a test account
   - Log in
   - Check dashboard loads

2. **Test authentication:**
   - Sign up with a test email
   - Log in
   - Log out
   - Check protected routes redirect to login

3. **Test Stripe (test mode):**
   - Go to /billing
   - Click upgrade to Pro
   - Use test card: `4242 4242 4242 4242`
   - Any future date, any CVC
   - Check webhook is received

4. **Check database:**
   - Verify users are being created
   - Check subscriptions table
   - Use Prisma Studio: `npx prisma studio`

---

### Step 9: Set Up Custom Domain (Optional)

1. **In Vercel project settings:**
   - Go to "Domains"
   - Click "Add"
   - Enter your domain (e.g., `linkedinanalytics.com`)

2. **Configure DNS:**
   - Add CNAME record in your DNS provider
   - Point to `cname.vercel-dns.com`
   - Wait for verification (can take up to 24 hours)

3. **Update environment variables:**
   - Change `NEXTAUTH_URL` to your custom domain
   - Change `NEXT_PUBLIC_URL` to your custom domain
   - Redeploy

---

### Step 10: Switch to Production Mode

Once you've tested everything with Stripe test mode:

1. **Get Stripe production keys:**
   - Toggle "View test data" OFF in Stripe dashboard
   - Copy production API keys
   - Update in Vercel environment variables

2. **Update webhook:**
   - Create new webhook for production
   - Use production signing secret

3. **Redeploy:**
   - Trigger a new deployment
   - All new subscriptions will be real

---

## 🔧 Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**
```bash
# Add to package.json:
"postinstall": "prisma generate"
```

**Error: "MODULE_NOT_FOUND"**
- Check all imports use `@/` alias
- Verify `tsconfig.json` paths are correct

**Error: "DATABASE_URL not found"**
- Check environment variable is set in Vercel
- Verify it's available in Production environment

### Runtime Errors

**Error: "NEXTAUTH_URL is not defined"**
- Set `NEXTAUTH_URL` in Vercel environment variables
- Should match your deployed URL

**Error: "Prisma Client initialization"**
- Run `npx prisma generate` locally
- Commit `node_modules/.prisma` if needed
- Or add postinstall script

**Error: "Invalid session"**
- Check `NEXTAUTH_SECRET` is set
- Verify it's at least 32 characters
- Clear browser cookies

### Stripe Webhook Issues

**Webhooks not being received:**
- Verify webhook URL is correct
- Check webhook signing secret matches
- Check Vercel function logs
- Test with Stripe CLI locally first

**Test webhook locally:**
```bash
stripe listen --forward-to localhost:3000/api/subscription/webhook
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Vercel Analytics:**
   - Go to project settings
   - Click "Analytics"
   - Enable Web Analytics
   - Upgrade to Pro for more features (optional)

### Vercel Logs

1. **View logs:**
   - Go to project → Functions
   - Click on any function
   - View real-time logs

### PostHog (Optional)

1. **Sign up at [posthog.com](https://posthog.com)**
2. Create new project
3. Copy Project API Key
4. Add to Vercel environment variables:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com`
5. Redeploy

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default secrets
- [ ] Use strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Enable HTTPS only (Vercel does this automatically)
- [ ] Set up proper CORS if needed
- [ ] Review Prisma queries for SQL injection protection (Prisma handles this)
- [ ] Test authentication flows thoroughly
- [ ] Verify password hashing is working
- [ ] Test session expiration
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Enable rate limiting on API routes (future enhancement)
- [ ] Review and test all user inputs
- [ ] Set up backup strategy for database
- [ ] Enable database SSL (should be default)

---

## 🎯 Performance Optimization

### After deployment:

1. **Enable caching:**
   - Vercel automatically caches static assets
   - Add caching headers to API routes if needed

2. **Optimize images:**
   - Use Next.js Image component
   - Already configured in the app

3. **Monitor Core Web Vitals:**
   - Use Vercel Analytics
   - Check Lighthouse scores

4. **Database optimization:**
   - Monitor slow queries
   - Add indexes if needed (already done in schema)
   - Use connection pooling (Prisma handles this)

---

## 📝 Post-Deployment Tasks

### Immediate:

- [ ] Test signup/login flow
- [ ] Test LinkedIn data sync (manual test)
- [ ] Verify database migrations ran
- [ ] Test Stripe checkout (test mode)
- [ ] Check all pages load correctly
- [ ] Test mobile responsiveness
- [ ] Verify email functionality (if configured)

### Within 24 hours:

- [ ] Set up monitoring/alerts
- [ ] Create backup strategy
- [ ] Test Stripe webhook
- [ ] Create test user accounts
- [ ] Document any issues
- [ ] Plan first user onboarding

### Within 1 week:

- [ ] Gather initial user feedback
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Review Vercel analytics
- [ ] Plan feature iterations
- [ ] Set up customer support channel

---

## 🚨 Rollback Plan

If deployment has critical issues:

1. **Revert to previous deployment:**
   - Go to Vercel dashboard
   - Click on previous successful deployment
   - Click "Promote to Production"

2. **Or push a fix:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Database rollback:**
   - Prisma migrations are forward-only
   - Restore from backup if needed
   - Or manually fix data

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Stripe Docs**: https://stripe.com/docs
- **NextAuth Docs**: https://authjs.dev

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Application loads at deployed URL
✅ Users can sign up and log in
✅ Dashboard shows (even if empty)
✅ Database is connected and migrations ran
✅ No console errors on frontend
✅ No 500 errors in Vercel logs
✅ Stripe test checkout works
✅ All environment variables are set

---

## Next Steps After Deployment

1. **Create Chrome Extension** for LinkedIn data collection
2. **Implement Stripe Webhook Handler** for subscription updates
3. **Add CSV Export** functionality
4. **Build Best Time Heatmap** component
5. **Set up Resend Email** integration
6. **Add Loading States** throughout app
7. **Implement Error Boundaries** for better UX
8. **Create Onboarding Flow** for new users
9. **Add Help Documentation**
10. **Plan Marketing Strategy**

---

**Deployment Checklist PDF**: Available in project docs
**Video Tutorial**: Coming soon
**Support**: Open an issue on GitHub

---

**Good luck with your deployment! 🚀**

Last Updated: 2025-10-25
Version: 1.0
