# Admin Browser Notifications - Testing Checklist

**Feature:** Real-time admin browser notifications for new user signups  
**Last Updated:** 2026-05-06  
**Status:** Ready for QA Testing

---

## Phase 4: End-to-End Testing

### 1. Notification Permission Flow ✓

#### 1.1 Desktop Browser (Chrome/Brave)
- [ ] Visit `/admin` dashboard
- [ ] Verify notification permission banner appears (blue banner with bell icon)
- [ ] Click "Enable" button
- [ ] Browser permission prompt appears requesting notification access
- [ ] Grant permission in browser dialog
- [ ] Notification banner disappears from dashboard
- [ ] Reload page → banner should NOT reappear (permission persisted)
- [ ] Check browser console: no errors logged

#### 1.2 Desktop Browser (Safari/Firefox)
- [ ] Repeat steps 1.1 on Safari and Firefox
- [ ] Verify same behavior across browsers
- [ ] Check browser-specific permission handling works

#### 1.3 Denied Permission Handling
- [ ] Visit `/admin` with notifications disabled
- [ ] Click "Enable" button
- [ ] Deny browser permission in dialog
- [ ] Notification banner should remain visible
- [ ] No JavaScript errors in console
- [ ] Admin can try again later

#### 1.4 Already Granted Permission
- [ ] Manually grant notifications via browser settings before visiting dashboard
- [ ] Visit `/admin`
- [ ] Notification banner should NOT appear
- [ ] Dashboard loads normally

---

### 2. Signup → Notification Delivery

#### 2.1 Single Admin Notification
- [ ] Have one admin logged in with notifications enabled on `/admin`
- [ ] Open a new incognito window and visit landing page (`/`)
- [ ] Fill signup form: name="Test Company", email="test@example.com", phone="9999999999"
- [ ] Click submit
- [ ] Verify signup succeeds (check `/login` page loads)
- [ ] Within 2-3 seconds, admin receives desktop notification showing:
  - Title: "🔔 New Lead"
  - Body: "Test Company (test@example.com) just signed up"
- [ ] Clicking notification takes admin back to `/admin` page
- [ ] Browser console has no errors on either window

#### 2.2 Multiple Admins Notification
- [ ] Have 2+ admins logged in with notifications enabled
- [ ] Perform signup from landing page
- [ ] Verify ALL admins receive notification simultaneously
- [ ] Each notification shows correct signup details

#### 2.3 Admin Without Notifications
- [ ] Have one admin with notifications disabled (banner visible)
- [ ] Have another admin with notifications enabled
- [ ] Perform new signup
- [ ] Only the admin with enabled notifications receives notification
- [ ] Admin without notifications does not receive anything

#### 2.4 Recent Signups Feed
- [ ] Perform 3-5 new signups from landing page
- [ ] Admin dashboard "Recent Signups" section updates in real-time
- [ ] Each signup shows:
  - Company name (displayed as "name" field)
  - Email address
  - Phone number (if provided)
  - Time ago ("Just now", "2m ago", etc.)
- [ ] Signups are ordered with newest first
- [ ] Timestamps update correctly as time passes

#### 2.5 No Notifications Without Subscription
- [ ] Admin clicks "Enable" but then immediately closes browser
- [ ] Perform new signup
- [ ] No notification appears (service worker not registered)
- [ ] No errors in backend logs

---

### 3. Mobile Responsiveness

#### 3.1 Tablet (iPad/Android Tablet)
- [ ] Visit admin dashboard on tablet
- [ ] Notification banner displays correctly (not cut off)
- [ ] Recent Signups feed is readable
- [ ] Items don't overlap
- [ ] Click "Enable" → works on tablet

#### 3.2 Mobile Phone (iPhone/Android)
- [ ] Visit admin dashboard on mobile phone
- [ ] Notification banner text wraps correctly
- [ ] Recent Signups list is scrollable
- [ ] Each signup item fits on screen
- [ ] Click "Enable" → works on mobile
- [ ] Notification appears on lock screen when granted

#### 3.3 Responsive Breakpoints
- [ ] Test at 320px (small phone)
- [ ] Test at 640px (large phone)
- [ ] Test at 1024px (tablet)
- [ ] Test at 1440px+ (desktop)
- [ ] Verify layout maintains integrity at all sizes

---

### 4. Browser Compatibility

#### 4.1 Chrome/Brave
- [ ] Grant notifications → works
- [ ] Receive notification → displays correctly
- [ ] Click notification → navigates to `/admin`
- [ ] Icon and badge display properly
- [ ] No console errors

#### 4.2 Safari
- [ ] Grant notifications via Safari settings
- [ ] Receive notification → appears in macOS notification center
- [ ] Click notification → returns to app
- [ ] Verify VAPID handshake works (check Network tab)

#### 4.3 Firefox
- [ ] Grant notifications → works
- [ ] Receive notification → displays in Firefox notification area
- [ ] Click notification → focuses admin window
- [ ] Verify service worker loads correctly

#### 4.4 Edge (Windows/macOS)
- [ ] Grant notifications → works
- [ ] Receive notification → displays in Windows notification center
- [ ] Behavior matches Chrome (based on Chromium engine)

---

### 5. Error Handling & Edge Cases

#### 5.1 Network Interruption During Signup
- [ ] Turn off network mid-signup form submission
- [ ] Verify form shows error message
- [ ] Admin does NOT receive notification
- [ ] Network comes back online → no delayed notification

#### 5.2 Invalid VAPID Keys
- [ ] Set VAPID_PUBLIC_KEY to invalid value in environment
- [ ] Click "Enable" notifications
- [ ] Browser permission prompt still appears
- [ ] After granting permission, notification won't be received
- [ ] Check server logs: VAPID setup error logged
- [ ] No JavaScript errors shown to user

#### 5.3 Service Worker Registration Failure
- [ ] Disable JavaScript temporarily in browser
- [ ] Try to enable notifications
- [ ] Fails gracefully (no white screen of death)
- [ ] Enable JavaScript → works normally

#### 5.4 Admin Role Verification
- [ ] Create regular user (not admin) and sign them up
- [ ] Verify regular user does NOT receive notifications
- [ ] Only actual admins (role='admin') receive notifications

#### 5.5 Rapid Successive Signups
- [ ] 5+ users sign up within 30 seconds
- [ ] Admins receive ALL notifications (none are dropped)
- [ ] All notifications appear in correct order
- [ ] Recent Signups feed shows all 5+ users

#### 5.6 Duplicate Signup Attempts
- [ ] User tries to sign up with same email twice
- [ ] First signup succeeds, admin notified
- [ ] Second signup fails (email exists)
- [ ] Admin does NOT receive second notification

---

### 6. Performance & Load Testing

#### 6.1 Dashboard Load Time
- [ ] Admin dashboard loads in < 2 seconds
- [ ] With 50 recent signups visible
- [ ] No lag when scrolling through signups

#### 6.2 Notification Delivery Time
- [ ] Signup form submission at t=0
- [ ] Notification received at t=<3 seconds
- [ ] Average delivery time: 0.5-1 second

#### 6.3 Multiple Admins Under Load
- [ ] 10 admins all with notifications enabled
- [ ] 20 signups within 2 minutes
- [ ] All admins receive all notifications
- [ ] No performance degradation
- [ ] Server CPU/memory reasonable

#### 6.4 Service Worker Memory
- [ ] Service worker registered
- [ ] Check DevTools → Application → Service Workers
- [ ] Memory usage < 10MB
- [ ] Survives browser restart

---

### 7. Security Testing

#### 7.1 XSS Prevention
- [ ] Signup with name: `<script>alert('xss')</script>`
- [ ] Verify script does NOT execute in notification
- [ ] Verify script does NOT execute in Recent Signups feed
- [ ] Data is properly escaped

#### 7.2 CSRF Protection
- [ ] Verify notification subscription request includes proper auth token
- [ ] Verify unauthorized users cannot subscribe to notifications

#### 7.3 Authorization
- [ ] Non-admin users cannot access `/admin` page
- [ ] Non-admin users do not receive notifications
- [ ] Only authenticated users can enable notifications

#### 7.4 Data Privacy
- [ ] Signups contain real user data (email, phone)
- [ ] Verify data is not logged to client console unnecessarily
- [ ] Check network requests don't expose PII in URLs

---

### 8. User Experience Testing

#### 8.1 Notification Banner UX
- [ ] Banner is visually distinct (blue background)
- [ ] Bell icon is clear and recognizable
- [ ] Text is readable: "Get instant signup notifications"
- [ ] "Enable" button is obvious and clickable
- [ ] Banner only shows when permission not granted

#### 8.2 Notification Content UX
- [ ] Company name is the most important info (shown first)
- [ ] Email is secondary info (shown in body)
- [ ] Timestamp is clear ("Just now", "2m ago")
- [ ] Clicking notification is intuitive

#### 8.3 Notification Interaction
- [ ] User can dismiss notification by clicking X
- [ ] Notification auto-dismisses after 4-6 seconds (if required)
- [ ] Clicking notification focuses browser/app
- [ ] Recent Signups feed complements notification (no duplication)

#### 8.4 Setup Friction
- [ ] First-time admin setup: < 10 seconds to enable
- [ ] Clear call-to-action in banner
- [ ] No confusing technical jargon
- [ ] One click to enable (after granting browser permission)

---

## Testing Sign-Off

### Tester Information
- **Name:** ___________________
- **Date:** ___________________
- **Browser(s) Tested:** ___________________
- **OS:** ___________________

### Results Summary
- **Total Test Cases:** 60+
- **Passed:** _____
- **Failed:** _____
- **Blocked/Skipped:** _____

### Critical Issues Found
(List any blocking issues that prevent production deployment)
- [ ] (None)
- [ ] Issue: ___________________

### Minor Issues Found
(List any non-blocking issues for future improvement)
- [ ] (None)
- [ ] Issue: ___________________

### Final Recommendation
- [ ] **APPROVED** - Ready for production
- [ ] **APPROVED WITH NOTES** - Ready, but with documented improvements
- [ ] **REJECTED** - Do not deploy (critical issues present)

---

## Automated Testing Notes

For future CI/CD pipeline, consider adding:
- End-to-end tests using Playwright/Cypress
- API integration tests for notification delivery
- Service Worker unit tests
- VAPID key validation tests
- Database query tests for admin retrieval
