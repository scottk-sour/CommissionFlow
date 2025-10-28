# 🔄 DATABASE MIGRATION TO ETSY SCHEMA

## ⚠️ IMPORTANT: Run This When You're Ready to Pivot

This will **delete all existing data** (tasks, projects, goals, habits).
Since you have no users yet, this is **safe to do**.

---

## 📋 What This Migration Does

**Removes:**
- Task, Project, Goal, Habit, HabitLog, EnergyLog, WeeklyReview, Meeting models
- All CEO Command Center specific fields from User model

**Adds:**
- EtsyShop model (connected shops with OAuth tokens)
- Product model (Etsy listings with inventory)
- Order model (Etsy orders with fulfillment)
- OrderItem model (line items with profit tracking)
- StockAlert model (low stock notifications)

**Keeps:**
- User model (auth, subscription, email preferences)
- All Stripe billing integration
- Email digest system

---

## 🚀 How to Run This Migration

### **Option 1: Fresh Start (Recommended if No Production Data)**

```bash
cd /home/user/Scott-Davies/ceo-command-center

# This deletes everything and creates fresh Etsy schema
npx prisma migrate reset --force

# Create new migration
npx prisma migrate dev --name pivot_to_etsy_schema

# Generate Prisma Client
npx prisma generate
```

---

### **Option 2: Keep User Data (If You Have Test Accounts)**

```bash
cd /home/user/Scott-Davies/ceo-command-center

# Create migration without resetting
npx prisma migrate dev --name pivot_to_etsy_schema

# Prisma will ask if you want to apply changes
# Answer: Yes
```

**Note:** This will drop CEO Command Center tables but keep users.

---

## ✅ Verify Migration Worked

After running migration, check:

```bash
# Should show new Etsy tables
npx prisma studio

# Look for:
# - User (simplified)
# - EtsyShop
# - Product
# - Order
# - OrderItem
# - StockAlert
```

---

## 🔧 If You Get Errors

### **Error: "Can't drop tables with data"**
```bash
# Force reset (safe if no users)
npx prisma migrate reset --force --skip-seed
```

### **Error: "Migration failed"**
```bash
# Delete migrations folder and start fresh
rm -rf prisma/migrations
npx prisma migrate dev --name initial_etsy_schema
```

### **Error: "Prisma engine not found"**
```bash
# Reinstall Prisma
npm install prisma @prisma/client --force
npx prisma generate
```

---

## 📊 New Schema Overview

### **EtsyShop**
- Stores OAuth tokens (encrypted)
- Shop name, URL, currency
- Last sync timestamp
- Default stock threshold

### **Product**
- Synced from Etsy listings
- Current quantity (stock level)
- Price, cost per unit (for profit calc)
- SKU, title, description
- Views, favorites from Etsy

### **Order**
- Synced from Etsy orders
- Customer info
- Subtotal, shipping, tax, total
- Etsy fees (for profit calculation)
- Status: PENDING, SHIPPED, DELIVERED, etc.
- Tracking number, carrier

### **OrderItem**
- Line items in orders
- Links to Product (if exists)
- Quantity, price at time of order
- Cost per unit (for profit calc)

### **StockAlert**
- LOW_STOCK, OUT_OF_STOCK, BACK_IN_STOCK
- Email sent tracking
- Acknowledged/resolved status

---

## 🎯 After Migration, Update These Files

You'll need to update code that references old models:

### **Delete These Directories:**
```bash
rm -rf src/app/(dashboard)/tasks
rm -rf src/app/(dashboard)/projects
rm -rf src/app/(dashboard)/goals
rm -rf src/app/(dashboard)/habits
rm -rf src/app/(dashboard)/energy
rm -rf src/app/(dashboard)/review
rm -rf src/app/(dashboard)/meetings
```

### **Update Dashboard:**
File: `src/app/(dashboard)/dashboard/page.tsx`

Change from Task/Project/Goal stats to Etsy stats:
```typescript
// OLD:
const stats = await getDashboardStats(userId)
// Shows: tasks today, projects active, habits tracked

// NEW:
const stats = await getEtsyShopStats(userId)
// Shows: total products, low stock items, orders this week, revenue
```

### **Update Sidebar/Navigation:**
File: `src/components/layout/Sidebar.tsx`

Change links from:
- /tasks → /products
- /projects → /orders
- /goals → /analytics
- Remove: habits, energy, review, meetings

---

## 🚀 Ready?

When you're ready to pivot:

1. ✅ Backup current branch (already did: `backup-ceo-command-center`)
2. ✅ Run migration (above commands)
3. ✅ Delete old feature pages
4. ✅ Update dashboard
5. ✅ Update navigation
6. ✅ Test signup flow
7. ✅ Deploy!

---

## 💾 Rollback (If Needed)

If you change your mind:

```bash
# Restore old schema
cp prisma/schema-old-ceo.prisma prisma/schema.prisma

# Reset and migrate back
npx prisma migrate reset --force
npx prisma migrate dev --name restore_ceo_schema
```

---

## ❓ Questions?

Come back to Claude and ask! I can help with:
- Migration errors
- Updating specific files
- Building new Etsy pages
- Connecting Etsy API

**You're almost there! 🎉**
