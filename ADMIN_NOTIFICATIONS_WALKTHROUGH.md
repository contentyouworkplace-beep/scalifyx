# Admin Notifications - End-to-End Feature Walkthrough

**Purpose:** Complete walkthrough of the admin notification feature from setup through receiving notifications  
**Time Required:** 15-20 minutes  
**Prerequisites:** Admin access, Chrome/Safari/Firefox browser, notifications enabled in OS

---

## Pre-Flight Checklist

Before starting the walkthrough, verify:

- [ ] Admin account exists with `role = 'admin'` in profiles table
- [ ] VAPID keys configured in backend environment:
  ```bash
  echo $VAPID_PUBLIC_KEY    # Should output non-empty Base64 string
  echo $VAPID_PRIVATE_KEY   # Should output non-empty private key
  ```
- [ ] `web_push_subscriptions` table created in database
- [ ] Service worker deployed at `/public/service-worker.js`
- [ ] Backend server running with web push routes
- [ ] Frontend deployed with notifications.ts library

**If any items fail:** See [Deployment & Configuration](ADMIN_NOTIFICATIONS_DOCS.md#deployment--configuration) section in docs.

---

## Part 1: Admin Dashboard Setup (5 minutes)

### Step 1.1: Access Admin Dashboard

1. Open browser and navigate to `https://yourapp.com/admin`
2. Log in with admin account (if not already logged in)
3. You should see the dashboard with:
   - **Header:** "Welcome, [Your Name]"
   - **Stat Cards:** Total Users, Active Sites, Revenue, Pending
   - **Quick Actions:** Users, Chats, Subscriptions, Payments, Notifications
   - **Notification Banner:** "Get instant signup notifications" (blue banner)

### Step 1.2: Verify Notification Banner

**Expected:** Blue banner appears with:
- Bell icon 🔔
- Text: "Get instant signup notifications"
- Subtext: "Enable browser notifications to get alerted when users sign up"
- "Enable" button

**If banner doesn't appear:**
- Notifications may already be enabled
- Check: Browser Settings → Privacy → Notifications
- If `yourapp.com` shows "Allow", banner won't appear (expected)

### Step 1.3: Check Recent Signups Section

1. Scroll down on admin dashboard
2. Find "Recent Signups" section
3. You should see:
   - List of recent new user signups
   - Each signup shows: Company Name, Email, Phone (if provided), Time (e.g., "2m ago")
   - If no signups: Empty state message "No recent signups"

**This is the manual feed.** Notifications will supplement (not replace) this.

---

## Part 2: Enable Notifications (3-5 minutes)

### Step 2.1: Click Enable Button

1. On the blue notification banner, click **"Enable"** button
2. You should see: Button changes to "Setting up..." (disabled)
3. Within 1 second: Browser prompts you for notification permission:
   - Chrome/Brave: "yourapp.com" wants to show notifications
   - Safari: Notification permission dialog
   - Firefox: Notification permission bar

### Step 2.2: Grant Browser Permission

1. In the browser permission dialog, click **"Allow"** (or equivalent)
2. Permission is granted to your domain
3. Back on the admin dashboard:
   - Button returns to enabled state
   - **Wait 2 seconds...**
   - Blue notification banner should **disappear** (notifications now enabled)

**Verification:**
- Banner is gone ✓
- You can proceed to testing notifications

### Step 2.3: Verify Service Worker Registration

1. Open browser **DevTools** (`F12` or `Cmd+Option+J`)
2. Go to **Application** tab
3. On left sidebar, click **Service Workers**
4. You should see:
   - URL: `https://yourapp.com/service-worker.js`
   - Status: **"activated and running"** (green dot)
   - Scope: `https://yourapp.com/`

**If status is "installing":**
- Wait 5-10 seconds for activation
- Refresh page if still installing

**If service worker doesn't appear:**
- Check console for errors (back to Console tab)
- Verify `/public/service-worker.js` was deployed
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## Part 3: Trigger a New Signup (3 minutes)

### Step 3.1: Open Landing Page in Incognito Window

**Why incognito?** Keeps signup session separate from admin session

1. **Keep admin dashboard open** in current window/tab
2. **Open new incognito window** (or private browsing):
   - Chrome/Brave: `Cmd+Shift+N` (Mac) or `Ctrl+Shift+N` (Windows)
   - Safari: `Cmd+Shift+N` (File → New Private Window)
   - Firefox: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
3. In incognito window, navigate to: `https://yourapp.com/` (landing page)

### Step 3.2: Fill Out Signup Form

On the landing page, you should see a signup form with fields:
- Email
- Password
- Full Name (currently says "Full name" placeholder)
- Phone (optional)

**Fill in test data:**
- **Email:** `test+[timestamp]@example.com` (e.g., `test+20260506-153000@example.com`)
  - Using timestamp makes each email unique
  - Allows multiple tests without email collision
- **Password:** `TestPassword123!` (or any password meeting requirements)
- **Full Name:** `Test Company Inc` (test company name)
- **Phone:** `+1-800-555-0001` (optional, but helpful for testing)

### Step 3.3: Submit Signup Form

1. Click **"Sign Up"** button
2. Form should validate and submit
3. You should see success message or redirect to login page
4. **Important:** Do NOT close this window (we'll use it to verify non-duplication)

---

## Part 4: Receive Notification (1-2 minutes)

### Step 4.1: Watch for Notification

1. **Switch back to admin dashboard window**
2. **Wait 1-3 seconds**
3. **Watch top-right of screen** (macOS) or **bottom-right** (Windows)
4. Desktop notification should appear showing:
   - **Title:** 🔔 New Lead
   - **Body:** Test Company Inc (test+[timestamp]@example.com) just signed up
   - **Icon:** App favicon

**Timeline:**
- t=0s: Click submit on signup form
- t=1-2s: Notification appears on admin's screen
- t=4-6s: Notification auto-dismisses (or user can click X)

### Step 4.2: Interact with Notification

**Option A: Click the notification**
1. Click anywhere on the notification
2. Notification closes
3. Browser window focuses (comes to foreground)
4. Admin dashboard loads/focuses
5. Recent Signups feed should show new signup at top

**Option B: Let it auto-dismiss**
1. Notification automatically disappears after 4-6 seconds
2. Admin can still see signup in Recent Signups feed
3. No action required

**Option C: Dismiss notification**
1. Click the X or close button on notification
2. Notification closes
3. Browser window not affected
4. Signup still visible in Recent Signups feed

### Step 4.3: Verify in Recent Signups Feed

1. On admin dashboard, scroll down to **Recent Signups** section
2. You should see your test signup at the **top of the list**:
   - **Company Name:** Test Company Inc
   - **Email:** test+[timestamp]@example.com
   - **Phone:** +1-800-555-0001
   - **Time:** Just now (or very recent)

---

## Part 5: Verify Data Integrity (2 minutes)

### Step 5.1: Check Database (Admin)

**In browser DevTools or via database client:**

```sql
-- Check if new user was created in profiles table
SELECT id, email, name, phone, role, created_at 
FROM profiles 
WHERE email = 'test+[timestamp]@example.com'
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected result:**
- `email`: test+[timestamp]@example.com
- `name`: Test Company Inc
- `phone`: +1-800-555-0001
- `role`: user (or null, not 'admin')
- `created_at`: Recent timestamp (within last minute)

### Step 5.2: Check Subscription

```sql
-- Verify admin's push subscription was saved
SELECT user_id, subscription->>'endpoint' as endpoint, created_at
FROM web_push_subscriptions
WHERE user_id = '[your_admin_id]'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected result:**
- `user_id`: [your admin's UUID]
- `endpoint`: https://fcm.googleapis.com/fcm/send/... (long URL)
- `created_at`: When you clicked "Enable" (recent)

---

## Part 6: Advanced Testing (5-10 minutes)

### Test 6.1: Multiple Signups in Rapid Succession

**Purpose:** Verify system handles many signups without dropping notifications

1. **Open 3 incognito windows** (for 3 parallel signups)
2. **In each window:** Go to landing page
3. **Simultaneously fill and submit signup forms** with different emails:
   - Window 1: test-001@example.com
   - Window 2: test-002@example.com
   - Window 3: test-003@example.com
4. **On admin dashboard:** Watch for 3 notifications (may arrive within 2-3 seconds)
5. **Check Recent Signups:** All 3 should appear at top

**Expected:** All 3 notifications delivered, no drops

### Test 6.2: Disable and Re-enable Notifications

**Purpose:** Verify enable/disable toggle works correctly

1. On admin dashboard, click **"Enable"** button again
   - Button should be disabled
   - Note: Banner has disappeared (already enabled)
2. Open browser console: `Cmd+Option+J` (Mac)
3. Run test:
   ```javascript
   navigator.serviceWorker.getRegistration().then(reg => {
     reg.pushManager.getSubscription().then(sub => {
       console.log('Subscription active:', !!sub);
     });
   });
   ```
4. Result: `Subscription active: true` (notifications enabled)

**To disable (future feature):**
- Currently: Must use browser Settings → Privacy → Notifications → Block

### Test 6.3: Mobile Responsiveness

**Purpose:** Verify notification feature works on mobile browsers

1. **On iPhone/Android:** Open mobile browser
2. Navigate to: https://yourapp.com/admin
3. Log in with admin account
4. Should see:
   - Notification banner (may be taller on mobile)
   - "Enable" button responsive/tappable
   - Recent Signups feed scrollable
5. Click "Enable"
6. Grant notification permission
7. Sign up from different device
8. Notification appears on lock screen (even if app in background)

**Expected:** Everything responsive, notifications work on mobile

---

## Part 7: Troubleshooting During Walkthrough

### Issue: Notification Doesn't Appear

**Checklist:**
1. [ ] Did you click "Enable"? (Check if banner disappeared)
2. [ ] Did you grant browser permission? (Check Settings → Privacy → Notifications)
3. [ ] Is admin dashboard still open/focused? (Notification won't appear in background)
4. [ ] Did you wait 2-3 seconds? (Delivery can take 1-2 seconds)
5. [ ] Check browser console for errors: `F12` → Console tab

**Common Errors:**
- `VAPID setup error` → VAPID keys not configured (backend logs)
- `Service worker not registered` → Hard refresh with `Cmd+Shift+R`
- `Subscription endpoint invalid` → Try disabling and re-enabling notifications

### Issue: Signup Form Submission Fails

**Causes:**
1. Password too weak (minimum 6 characters, ideally 8+)
2. Email already used (use timestamp in email)
3. Network error (check DevTools → Network)

**Solution:**
- Use unique email: `test+[timestamp]@example.com`
- Use strong password: `TestPass123!`
- Check network request succeeded (200 status)

### Issue: Multiple Admins (Not Applicable for Solo Testing)

**For multi-admin testing:**
1. Admin A: Enable notifications, keep dashboard open
2. Admin B: Enable notifications in different browser/window
3. Sign up new user
4. Verify BOTH admins receive notification
5. Check: Both have subscriptions in `web_push_subscriptions` table

---

## Part 8: Success Criteria

✅ **Walkthrough successful if:**

- [ ] Notification banner appears on admin dashboard
- [ ] Clicking "Enable" works (button shows "Setting up...", then banner disappears)
- [ ] Browser grants notification permission
- [ ] Service worker activates (visible in DevTools)
- [ ] New signup triggers notification within 1-3 seconds
- [ ] Notification contains: title "🔔 New Lead" and company name + email
- [ ] Clicking notification focuses browser/dashboard
- [ ] Recent Signups feed updates with new signup
- [ ] Database shows new user created
- [ ] Database shows push subscription saved

**If all items checked:** ✅ Feature is working correctly!

**If any items failed:** See [Troubleshooting](ADMIN_NOTIFICATIONS_DOCS.md#troubleshooting) in full documentation.

---

## Part 9: Quick Reference

### Keyboard Shortcuts
| Action | Mac | Windows |
|--------|-----|---------|
| Open DevTools | `Cmd+Option+J` | `F12` |
| Incognito/Private | `Cmd+Shift+N` | `Ctrl+Shift+N` |
| Hard Refresh | `Cmd+Shift+R` | `Ctrl+Shift+R` |
| Open Console | `Cmd+Option+J` | `F12` |

### Key Endpoints
```
Landing page:        GET  https://yourapp.com/
Admin dashboard:     GET  https://yourapp.com/admin
Signup API:          POST https://yourapp.com/api/auth/signup
VAPID public key:    GET  https://yourapp.com/api/notifications/vapid-public-key
Subscribe to push:   POST https://yourapp.com/api/notifications/subscribe-web
```

### Service Worker Check
```javascript
// In browser console on any page:
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker Scope:', reg?.scope);
  console.log('Service Worker URL:', reg?.active?.scriptURL);
  reg?.active?.postMessage({ type: 'PING' });
});
```

---

## Summary

This walkthrough demonstrates the complete flow:

1. **Admin enables notifications** (1 click + browser permission)
2. **User signs up** (fills form on landing page)
3. **Admin receives notification** (within 1-2 seconds)
4. **Notification links back to dashboard** (click to view signups)

**Total time:** 15-20 minutes end-to-end

**What you've verified:**
- Frontend notification service working
- Browser Web Push API integration
- Service Worker registration
- Backend signup flow
- Notification delivery pipeline
- Database persistence
- Recent signups feed updates

For production deployment, run the full [Testing Checklist](ADMIN_NOTIFICATIONS_TESTING.md).
