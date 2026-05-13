# Admin Dashboard Live Data Setup

## What Was Done

### 1. **Test Data Seeded** ✅
Created a comprehensive seed script (`backend/seed-data.js`) that populates Supabase with realistic test data:

- **5 Free Trial Users** - Active trial subscriptions ending in 7 days
- **2 Expired Trial Users** - Trial subscriptions ended 3 days ago
- **3 Paid Users** - Active paid subscriptions at ₹1,499/month
- **2 Domain Purchases** - Logged as transactions
- **6 Transactions** - For revenue calculation (monthly and total)
- **3 Test Websites** - For Recent Activity section

### 2. **Backend API Fixed** ✅
Updated `/api/admin/activity` endpoint to include `email` field in recent signups (was missing before).

File: `backend/src/routes/admin.js` (line 282)
- Added `email` to select fields for better user identification

### 3. **Admin Dashboard Metrics** ✅
The dashboard now displays real live data from Supabase:

| Metric | Value | Source |
|--------|-------|--------|
| Free Trial Users | 5 | subscriptions table (plan='trial') |
| Paid Users | 3 | subscriptions table (plan!='trial', status='active') |
| Domain Purchases | 2 | profiles table (domain_purchased=true) |
| Trial Expired (Not Upgraded) | 2 | subscriptions table (plan='trial', end_date<now) |
| Monthly New Users | 7 | profiles created this month |
| Monthly Revenue | ₹2,998 | transactions created this month |
| Total Lifetime Revenue | ₹4,497 | all completed transactions |

## How to Test

### Option 1: Use Admin Credentials
1. Go to http://localhost:3003/admin (frontend dev server should be running on port 3003)
2. Log in with:
   - Email: `scalifyxpro@gmail.com`
   - Password: `Vardaan@RM5678`
3. You should see all the real metrics populated:
   - "Free Trial Users: 5"
   - "Paid Users: 3"
   - "Domain Purchases: 2"
   - "Trial Expired (Not Upgraded): 2"
   - "Monthly New Users / Revenue: 7 users / ₹2,998"
   - "Total Lifetime Revenue: ₹4,497"

### Option 2: Test Recent Signups Section
The "Recent Signups" section now shows real test users:
- trial1@example.com
- trial2@example.com
- paid1@example.com
- paid2@example.com
- paid3@example.com

Each signup shows the time created (using "Just now", "Xm ago", "Xh ago", "Xd ago" formatting)

## API Endpoints

All endpoints require admin authentication:

### Dashboard Metrics
```
GET /api/admin/dashboard
Response:
{
  "metrics": {
    "totalFreeTrialUsers": 5,
    "domainPurchasedUsers": 2,
    "uniquePaidUsers": 3,
    "trialExpiredNotUpgraded": 2,
    "monthly": {
      "newUsers": 7,
      "revenue": 2998
    },
    "totalRevenue": 4497
  },
  "totals": {
    "totalUsers": 10
  }
}
```

### Recent Activity & Signups
```
GET /api/admin/activity
Response:
{
  "recentUsers": [...],    // Recent signups with id, name, email, phone, created_at
  "recentPayments": [...], // Recent payments
  "recentSites": [...]     // Recently created websites
}
```

## Database Schema Used

### profiles table
- `id` - User ID
- `email` - User email
- `name` - User name  
- `phone` - User phone
- `plan` - 'trial', 'pro', 'free'
- `domain_purchased` - boolean
- `created_at` - Signup timestamp

### subscriptions table
- `user_id` - Reference to user
- `plan` - 'trial' or 'pro'
- `status` - 'active' or 'expired'
- `amount` - Amount in rupees
- `start_date` - Subscription start
- `end_date` - Subscription end
- `auto_renew` - Renewal flag
- `created_at` - Timestamp

### transactions table
- `user_id` - Reference to user
- `type` - 'subscription' or 'domain_purchased'
- `amount` - Amount in rupees (0 for domain)
- `status` - 'completed'
- `created_at` - Transaction timestamp

### websites table
- `user_id` - Reference to user
- `business_name` - Business name
- `industry` - Industry type
- `deployed_url` - Website URL
- `status` - 'active', 'draft', etc.
- `pages` - Number of pages
- `created_at` - Created timestamp

## Running the Seed Script Again

If you need to re-seed the data (e.g., after clearing Supabase), run:

```bash
cd backend
node seed-data.js
```

This will create new test users and transactions. The script checks for duplicate emails to avoid errors on re-runs.

## Production Deployment

When deploying to production:
1. Run the seed script once to create a test admin user
2. Remove test data by deleting from Supabase directly or updating seed script
3. Real user data will automatically flow through the system as users sign up
4. All metrics will update live from the database

The dashboard will always show current data because it queries Supabase on each page load.
