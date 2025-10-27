# 🚀 QUICK DEPLOY GUIDE

## Deploy to Vercel in 3 Steps

### 1. Push to GitHub (if not done)
```bash
# Already done! ✅
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: `scottk-sour/Scott-Davies`
4. Root Directory: `ceo-command-center`
5. Click "Deploy"

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
# Database (from Neon.tech)
DATABASE_URL=postgresql://user:pass@host/dbname

# NextAuth Secret (generate below)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app

# Stripe (optional for now)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_...
```

### Generate NextAuth Secret
Run this command:
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations
After first deploy, in Vercel:
- Go to your deployment
- Click "Terminal" or use Vercel CLI:

```bash
npx vercel env pull
npx prisma migrate deploy
```

### 5. Done! 🎉
Your app is live at: `https://your-app.vercel.app`

---

## Test Your Deployment

1. Visit your URL
2. Click "Sign Up"
3. Create an account
4. Start using the app!

