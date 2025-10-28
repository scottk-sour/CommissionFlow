# Email Reminder System Setup Guide

This guide will help you set up the daily digest email reminders for CEO Command Center.

## Features

- **Daily Digest Email**: Morning summary with tasks, habits, and progress
- **Smart Content**: Only shows P0/P1 priority tasks, overdue tasks, and today's habits
- **User Preferences**: Users can enable/disable, set preferred time
- **Test Email**: Send preview email from settings page
- **Automated**: Runs via Vercel Cron (hourly check)

## Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Verified Domain**: Add and verify your sending domain in Resend

## Environment Variables

Add these to your `.env.local` (development) and Vercel (production):

```bash
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

# Email "from" address (must be from verified domain)
EMAIL_FROM="CEO Command Center <noreply@yourdomain.com>"

# App URL (used in email links)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Cron secret (generate a random string)
CRON_SECRET=your-random-secret-here
```

### Generating CRON_SECRET

```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

## Database Migration

Run the migration to add email preference fields to User table:

```bash
cd ceo-command-center
npx prisma migrate dev --name add_email_preferences
```

This adds:
- `emailDigestEnabled` (boolean, default: true)
- `emailDigestTime` (string, default: "08:00")
- `emailDigestTimezone` (string, default: "America/New_York")

## Vercel Deployment

### 1. Set Environment Variables in Vercel

Go to your project → Settings → Environment Variables and add:
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `NEXT_PUBLIC_APP_URL`
- `CRON_SECRET`

### 2. Deploy with Cron Configuration

The `vercel.json` file is already configured with:
```json
{
  "crons": [
    {
      "path": "/api/email/daily-digest",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs the digest check **every hour** (at minute 0).

### 3. Verify Cron Setup

After deployment:
1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You should see: `/api/email/daily-digest` scheduled for `0 * * * *`
3. Check execution logs to verify it's running

## How It Works

### Flow

1. **Cron Job** runs every hour (e.g., 8:00 AM, 9:00 AM, etc.)
2. **GET /api/email/daily-digest** endpoint is called
3. Finds all users with `emailDigestEnabled: true`
4. For each user, checks if current hour matches their `emailDigestTime`
5. Calls **POST /api/email/daily-digest** for matching users
6. POST endpoint:
   - Fetches tasks due today (P0/P1 priority)
   - Fetches overdue tasks
   - Fetches active habits
   - Calculates stats (streaks, completion rate, active projects)
   - Renders email template
   - Sends via Resend

### Email Content

The daily digest includes:
- **Stats Bar**: Total streak days, active projects, completion rate
- **Overdue Tasks** (if any): Shows up to 5, sorted by priority
- **Tasks Due Today**: Shows up to 5 P0/P1 tasks
- **Today's Habits**: All active habits with current streaks
- **CTA Button**: Links to dashboard

### User Settings

Users can configure in Settings page (`/settings`):
- Toggle email digest on/off
- Set preferred delivery time (HH:mm format)
- View timezone (auto-detected)
- Send test email

## Testing

### Send Test Email (Manual)

1. Log in to your app
2. Go to Settings (`/settings`)
3. Scroll to "Email Notifications" section
4. Click "Send Test Email"
5. Check your inbox

### Trigger via API (Development)

```bash
# Send digest for current user
curl -X POST http://localhost:3000/api/email/daily-digest \
  -H "Content-Type: application/json"

# Simulate cron job (requires CRON_SECRET)
curl -X GET http://localhost:3000/api/email/daily-digest \
  -H "Authorization: Bearer your-cron-secret"
```

### Check Logs

**Vercel:**
- Go to Deployments → Functions → `/api/email/daily-digest`
- View execution logs for errors

**Resend:**
- Log in to resend.com
- View "Emails" tab to see sent emails and delivery status

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**: Ensure it's correctly set in environment variables
2. **Verify Domain**: In Resend dashboard, confirm your domain is verified
3. **Check Logs**: Look for errors in Vercel function logs
4. **Test Manually**: Use "Send Test Email" button in settings

### Wrong Timezone

Currently, timezone handling is simplified (UTC-based). For production:
- Consider using a library like `date-fns-tz` or `luxon`
- Store user's timezone in database (auto-detect from browser)
- Calculate proper delivery time based on user's timezone

### Cron Not Running

1. Verify `vercel.json` is in root of `ceo-command-center` directory
2. Redeploy to ensure cron configuration is picked up
3. Check Vercel Dashboard → Cron Jobs tab
4. Ensure you're on a Vercel plan that supports Cron (Pro plan required)

### Rate Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day

For production with many users:
1. Upgrade Resend plan
2. Implement batching (send in chunks)
3. Add rate limiting logic

## Customization

### Change Email Content

Edit `/src/emails/DailyDigest.tsx`:
- Modify sections (tasks, habits, stats)
- Change styling
- Add new sections (goals, weekly review reminders)

### Change Delivery Schedule

Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/email/daily-digest",
      "schedule": "0 8 * * *"  // Daily at 8 AM UTC
    }
  ]
}
```

Cron syntax: `minute hour day month weekday`

Examples:
- `0 8 * * *` - Daily at 8 AM
- `0 */2 * * *` - Every 2 hours
- `0 8 * * 1-5` - Weekdays at 8 AM

### Add More Email Types

Follow the same pattern:
1. Create email template in `/src/emails/`
2. Create API endpoint in `/src/app/api/email/`
3. Add user preferences in database
4. Add UI in settings page
5. Set up cron if automated

Example ideas:
- Weekly review reminder (Sunday evening)
- P0 task reminder (6 PM if not completed)
- Habit streak about to break
- Monthly progress report

## Production Checklist

- [ ] Resend account created and domain verified
- [ ] Environment variables set in Vercel
- [ ] Database migration run (`npx prisma migrate deploy`)
- [ ] Vercel cron job configured and active
- [ ] Test email sent successfully
- [ ] Monitor Resend delivery rate
- [ ] Set up error alerting (Sentry, etc.)
- [ ] Consider upgrading Resend plan based on user count

## Support

For issues:
1. Check Vercel function logs
2. Check Resend dashboard for delivery status
3. Test manually with "Send Test Email" button
4. Review error messages in browser console (settings page)

---

**Last Updated**: 2025-10-28
