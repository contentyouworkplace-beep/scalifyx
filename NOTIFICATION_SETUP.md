# Web Push Notifications Setup Guide

## Overview

Scalify has a complete browser push notification system for real-time signup alerts to admins. This guide explains the setup and how to troubleshoot issues.

## Architecture

```
Frontend (Browser)
  ├─ PushNotificationBanner.tsx → Shows "Enable Notifications" prompt
  └─ notifications.ts → Handles subscription & registration
       ↓
Backend API
  ├─ /api/notifications/subscribe-web → Saves subscription to database
  ├─ /api/notifications/vapid-public-key → Returns VAPID public key
  └─ /api/notifications/test-send → Sends test notification
       ↓
Supabase Database
  └─ web_push_subscriptions table → Stores browser push subscriptions
       ↓
New Signup Event
  └─ auth.js:sendNewSignupNotifications() → Sends push to all admins
       ↓
Service Worker
  └─ service-worker.js → Displays notification in browser
```

## Prerequisites

### Frontend Environment Variables
File: `web/.env.local`
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-vapid-public-key>
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend Environment Variables
File: `backend/.env`
```
VAPID_EMAIL=mailto:your-email@domain.com
VAPID_PUBLIC_KEY=<your-vapid-public-key>
VAPID_PRIVATE_KEY=<your-vapid-private-key>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
```

### Database Setup
The `web_push_subscriptions` table must exist in Supabase. Run:
```bash
cd backend && node setup-db.js
```

## Step-by-Step Setup

### 1. Admin Clicks "Enable Notifications"
- Location: Admin Dashboard (`/admin`)
- Button: "Enable" in the notification banner
- Action: Opens browser permission dialog

### 2. Browser Request Permission
- User clicks "Allow" in the permission dialog
- Browser grants notification permission

### 3. Service Worker Registration
- Frontend registers `/service-worker.js`
- Browser creates a push subscription with VAPID keys
- Subscription contains: endpoint, auth key, p256dh key

### 4. Subscription Sent to Backend
- Frontend POSTs to `/api/notifications/subscribe-web`
- Backend saves subscription in `web_push_subscriptions` table
- Subscription is now stored in database

### 5. New Signup Triggers Notification
- User signs up on landing page
- Backend queries all admins (role='admin' in profiles table)
- For each admin, backend fetches their stored subscriptions
- Backend sends push notification via web-push library
- Service worker receives push event and displays notification

## Testing

### Verify Setup
```bash
cd backend
node diagnose-notifications.js
```

This shows:
- ✅ VAPID keys configured
- ✅ web-push module loaded
- ✅ Database table exists
- ✅ Admin users found
- ⚠️ Admin subscriptions status

### Manual Test (After Admin Enables Notifications)
Make a POST request to test endpoint:
```bash
curl -X POST http://localhost:3001/api/notifications/test-send \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json"
```

Or from admin panel, admin can:
1. Enable notifications
2. New test notification endpoint available for testing

### Expected Logs
When everything works, you should see in backend console:
```
📢 New signup detected: { name: 'John Doe', email: 'john@example.com' }
👨‍💼 Found 1 admin(s) to notify
  ↳ Notifying: ScalifyX Admin
🔔 Sending push notification to user: 9c3db12d...
📤 Found 1 subscription(s), sending notifications...
  ↳ Sending to subscription 1/1...
✅ 1/1 notifications sent successfully
```

## Troubleshooting

### "Enable" button not visible
- [ ] Check if `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is set in `web/.env.local`
- [ ] Service workers supported in your browser (Chrome, Firefox, Edge, etc.)
- [ ] Check browser DevTools Console for errors

### Button clicked but nothing happens
- [ ] Browser DevTools → Network tab → Check if POST to `/api/notifications/subscribe-web` succeeds
- [ ] Check backend console for errors
- [ ] Verify `web_push_subscriptions` table exists: `node diagnose-notifications.js`
- [ ] Check admin user has `role='admin'` in Supabase profiles table

### Subscriptions saved but no notifications received on signup
- [ ] Admin must have at least 1 subscription saved (checked with diagnose script)
- [ ] Check backend logs when new user signs up
- [ ] Verify VAPID keys match between frontend and backend
- [ ] Service worker must be registered (`/service-worker.js` exists)

### Test Notification Endpoint
After enabling notifications, test with:
```bash
# Login as admin first, get JWT token
curl -X POST http://localhost:3001/api/notifications/test-send \
  -H "Authorization: Bearer <your-jwt>" \
  -H "Content-Type: application/json"
```

Check backend console for logs about sending the test notification.

## Key Files

| File | Purpose |
|------|---------|
| `web/src/components/PushNotificationBanner.tsx` | UI prompt to enable notifications |
| `web/src/lib/notifications.ts` | Subscription & registration logic |
| `web/public/service-worker.js` | Handles incoming push events |
| `backend/src/routes/notifications.js` | API endpoints for subscriptions |
| `backend/src/lib/webPush.js` | Web push sending logic |
| `backend/src/routes/auth.js` | Sends notifications on new signup |
| `backend/setup-db.js` | Creates database tables |
| `backend/diagnose-notifications.js` | Diagnostic tool |

## Common Issues

### Issue: 403 Forbidden on subscribe-web endpoint
**Cause**: Admin not authenticated
**Fix**: Ensure JWT token is valid, admin is logged in

### Issue: "web_push_subscriptions table does not exist"
**Cause**: SQL migration not run
**Fix**: `cd backend && node setup-db.js`

### Issue: Notifications sent but not received
**Cause**: Service worker not registered or push payload malformed
**Fix**: Check browser DevTools → Application → Service Workers

## Next Steps

1. Run `node diagnose-notifications.js` to check current status
2. Have admin click "Enable Notifications" on `/admin`
3. Check `diagnose-notifications.js` output again to confirm subscription saved
4. Create test user to trigger signup notification
5. Check browser for notification and backend logs

---

For issues, check backend logs with debug output enabled.
