# 🔄 Pivoting CEO Command Center → Etsy Organizer

## ✅ What You Can KEEP (60-70% of code)

### **Infrastructure (All reusable)**
- ✅ Next.js 14 App Router setup
- ✅ TypeScript configuration
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Prisma setup (just change schema)
- ✅ PostgreSQL database (same DB, new tables)

### **Authentication (100% reusable)**
- ✅ `/src/lib/auth.ts` - Keep as-is
- ✅ `/src/app/(auth)/login` - Keep as-is
- ✅ `/src/app/(auth)/signup` - Keep as-is
- ✅ NextAuth configuration

### **Billing (100% reusable)**
- ✅ `/src/lib/stripe.ts` - Keep as-is
- ✅ Stripe integration
- ✅ Subscription management
- ✅ Pricing page (just update copy)

### **Email (100% reusable)**
- ✅ `/src/lib/email.ts` - Keep as-is
- ✅ Resend integration
- ✅ Email preferences in settings
- ✅ Daily digest structure (change content)

### **UI Components (100% reusable)**
- ✅ All `/src/components/ui/*` - Keep as-is
- ✅ Button, Card, Input, Label, etc.
- ✅ Dialog, Checkbox (just added!)
- ✅ Layout components (Sidebar, etc.)

### **Settings Page (90% reusable)**
- ✅ `/src/app/(dashboard)/settings/page.tsx` - Modify slightly
- ✅ Account info section - Keep
- ✅ Subscription section - Keep
- ✅ Email preferences - Keep

---

## 🔄 What to CHANGE

### **Database Schema**
**Replace:** `prisma/schema.prisma`
**With:** `prisma/schema-etsy.prisma` (I just created this)

**Changes:**
- ❌ Remove: Task, Project, Goal, Habit, HabitLog, EnergyLog, WeeklyReview, Meeting models
- ✅ Add: EtsyShop, Product, Order, OrderItem, StockAlert models
- ✅ Simplify User model (keep auth, subscription, email prefs)

### **Landing Page**
**File:** `/src/app/page.tsx`

**Change from:**
```tsx
<h1>Run Your Life Like a CEO Runs a Company</h1>
<p>Transform scattered to-do lists into strategic system</p>
```

**Change to:**
```tsx
<h1>Your Etsy Shop, Organized</h1>
<p>Track inventory, manage orders, and grow your shop—all in one place</p>
```

**Features to highlight:**
- Never run out of stock (low stock alerts)
- Track orders automatically (sync with Etsy)
- Calculate true profit (fees + costs)
- Simple shipping management
- One dashboard for everything

### **Dashboard**
**File:** `/src/app/(dashboard)/dashboard/page.tsx`

**Change from:** Tasks/Projects/Goals stats
**Change to:** Shop stats

```tsx
// New stats to show:
- Total products
- Low stock items
- Orders this week
- Revenue this month
- Top-selling products
```

### **Onboarding**
**File:** `/src/components/onboarding/WelcomeModal.tsx`

**Change from:** Sample tasks/projects/goals
**Change to:** Connect Etsy shop flow

```tsx
// New onboarding:
1. Welcome message
2. "Connect Your Etsy Shop" button → OAuth flow
3. Sync products automatically
4. Set stock thresholds
5. Done!
```

### **Navigation**
**File:** `/src/components/layout/Sidebar.tsx` (or wherever nav is)

**Change from:**
- Dashboard
- Tasks
- Projects
- Goals
- Habits
- Energy
- Review
- Meetings

**Change to:**
- Dashboard
- Products (inventory view)
- Orders (order management)
- Analytics (sales, profit)
- Settings

---

## ❌ What to REMOVE

### **Delete These Files:**
```bash
# Pages
/src/app/(dashboard)/tasks/
/src/app/(dashboard)/projects/
/src/app/(dashboard)/goals/
/src/app/(dashboard)/habits/
/src/app/(dashboard)/energy/
/src/app/(dashboard)/review/
/src/app/(dashboard)/meetings/

# Components (task-specific)
/src/components/tasks/
/src/components/projects/
/src/components/goals/
/src/components/habits/

# Keep these:
/src/components/dashboard/ - modify for Etsy stats
/src/components/shared/ - reuse
/src/components/ui/ - reuse all
```

---

## ✨ What to ADD (New Code)

### **1. Etsy OAuth Integration**
**New file:** `/src/lib/etsy.ts`

```typescript
// Etsy API client
// OAuth flow
// Token refresh
// API rate limiting
```

### **2. Products Page**
**New file:** `/src/app/(dashboard)/products/page.tsx`

**Features:**
- List all products from Etsy
- Show stock levels with color coding
- Edit stock manually
- Low stock badge
- Search/filter products

### **3. Orders Page**
**New file:** `/src/app/(dashboard)/orders/page.tsx`

**Features:**
- List orders from Etsy
- Filter by status (pending, shipped, etc.)
- Order details modal
- Mark as shipped
- Add tracking number

### **4. Product Detail Modal**
**New component:** `/src/components/products/ProductDetailModal.tsx`

**Shows:**
- Product image
- Current stock
- Cost per unit (user enters)
- Price from Etsy
- Sales history
- Edit stock level

### **5. Stock Alert System**
**New files:**
- `/src/app/api/stock/alerts/route.ts` - API to fetch alerts
- `/src/components/dashboard/StockAlerts.tsx` - Alert widget

**Features:**
- Check stock levels daily
- Send email if below threshold
- Show alerts in dashboard
- Acknowledge/dismiss alerts

### **6. Sync System**
**New files:**
- `/src/app/api/etsy/sync/route.ts` - Trigger sync
- `/src/app/api/etsy/webhook/route.ts` - Handle Etsy webhooks

**Features:**
- Manual sync button
- Auto-sync every hour (cron job)
- Webhook for real-time order updates

---

## 🗺️ Migration Steps

### **Step 1: Backup Current Work**
```bash
cd /home/user/Scott-Davies
git checkout -b backup-ceo-command-center
git push -u origin backup-ceo-command-center
```

### **Step 2: Apply New Schema**
```bash
# Backup current schema
cp prisma/schema.prisma prisma/schema-old.prisma

# Replace with Etsy schema
cp prisma/schema-etsy.prisma prisma/schema.prisma

# Create migration (WILL DROP ALL CURRENT TABLES)
npx prisma migrate dev --name pivot_to_etsy

# Or, if you want fresh start:
npx prisma migrate reset
npx prisma migrate dev --name initial_etsy_schema
```

⚠️ **WARNING:** This will delete all existing task/project/goal data.
Since you have no users yet, this is fine!

### **Step 3: Update Landing Page**
Edit `/src/app/page.tsx` with Etsy-focused copy (I can help with this)

### **Step 4: Update Onboarding**
Edit `/src/components/onboarding/WelcomeModal.tsx` to show Etsy connection flow

### **Step 5: Build Etsy OAuth**
Create `/src/lib/etsy.ts` and `/src/app/api/etsy/connect/route.ts`

### **Step 6: Build Products Page**
Create `/src/app/(dashboard)/products/page.tsx`

### **Step 7: Build Orders Page**
Create `/src/app/(dashboard)/orders/page.tsx`

### **Step 8: Update Dashboard**
Edit `/src/app/(dashboard)/dashboard/page.tsx` to show Etsy stats

---

## 📊 Reusability Breakdown

| Component | Reusable | Action |
|-----------|----------|--------|
| **Auth system** | 100% | Keep as-is |
| **Billing/Stripe** | 100% | Keep as-is |
| **Email system** | 100% | Keep as-is |
| **UI components** | 100% | Keep as-is |
| **Settings page** | 90% | Minor tweaks |
| **Landing page** | 70% | Update copy |
| **Dashboard** | 30% | New stats |
| **Onboarding** | 20% | New flow |
| **Feature pages** | 0% | Build new |

**Total code reuse: ~65%**

---

## ⏱️ Timeline Estimate

With existing codebase as foundation:

| Task | Time | Why Faster |
|------|------|------------|
| Schema migration | 1 day | Just change schema file |
| Landing page update | 1 day | Keep structure, new copy |
| Etsy OAuth | 3-5 days | New integration |
| Products page | 3-4 days | Use existing UI components |
| Orders page | 3-4 days | Use existing UI components |
| Stock alerts | 2-3 days | Use existing email system |
| Dashboard update | 2 days | Keep layout, new queries |
| Onboarding update | 1-2 days | Keep structure, new flow |

**Total: 3-4 weeks** (vs 6-8 weeks from scratch)

---

## 🎯 What to Do RIGHT NOW

### **Immediate Actions (Next 30 mins):**

1. ✅ **Apply for Etsy API access** (do this NOW, takes 1-2 weeks approval)
   - https://www.etsy.com/developers/register

2. ✅ **Post validation on r/EtsySellers** (copy my script from earlier)

3. ✅ **Backup current work**
   ```bash
   git checkout -b backup-ceo-command-center
   git push -u origin backup-ceo-command-center
   ```

### **This Week:**

4. ✅ **Replace database schema**
   ```bash
   cp prisma/schema-etsy.prisma prisma/schema.prisma
   npx prisma migrate reset  # Fresh start
   npx prisma migrate dev --name initial_etsy_schema
   ```

5. ✅ **Update landing page** (I'll help you write the copy)

6. ✅ **Schedule 10 interviews** from r/EtsySellers responses

### **Next 2-3 Weeks:**

7. ✅ **Build Etsy OAuth** (while waiting for API approval)
8. ✅ **Build Products page** (inventory management)
9. ✅ **Build Orders page** (order tracking)
10. ✅ **Beta launch** to validated customers

---

## 🚀 Ready to Start?

Say the word and I'll help you with:

1. **Backing up and migrating database** (5 minutes)
2. **Updating landing page copy** (30 minutes)
3. **Building Etsy OAuth** (when API approved)
4. **Building Products page** (reusing existing UI)

**You have a ~4 week head start** because of the existing codebase!

---

**Questions?** Ask me anything about the pivot plan.
