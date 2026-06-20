# 🚀 DEPLOY CHECKLIST — Ready to Ship

**Last Check**: May 27, 2026  
**Status**: ✅ READY

---

## Pre-Deploy Verification

### 1. Code Review
- [ ] `index.html` has React production CDN
- [ ] Mobile CSS media queries present
- [ ] SEO meta tags in place
- [ ] JSON-LD structured data added
- [ ] vercel.json has proper headers

### 2. Test Locally
```bash
cd /Users/alessandropiccinini/Desktop/live

# Install deps if needed
npm install

# Test build
npm run build
# Expected output: Image optimization completed ✅

# Start dev server
npm run dev
# Should run on http://localhost:3000

# Test in browser
# - Hero 3D scene loads
# - All pages navigate correctly
# - Mobile view responsive (dev tools)
# - API endpoints accessible
```

### 3. API Verification
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"ok":true,"timestamp":"...","uptime":...}

# Test contact endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Testing form"}'

# Test waitlist endpoint
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 4. Mobile Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Check touch interactions smooth
- [ ] Verify responsive layout at 768px
- [ ] Test form inputs (no zoom on iOS)
- [ ] Check scroll performance

### 5. Performance Check
```bash
# Optional: Run Lighthouse audit
# 1. Open http://localhost:3000
# 2. DevTools → Lighthouse
# 3. Run on Desktop & Mobile
# Expected scores: 85+ overall
```

---

## Deploy to Vercel

### Option A: Via CLI
```bash
# Make sure you're logged in
npm install -g vercel
vercel login

# Navigate to project
cd /Users/alessandropiccinini/Desktop/live

# Deploy
vercel --prod

# Vercel will ask:
# - Confirm project name: hertz-club ✅
# - Build settings: Leave as default ✅
# - Function: Deploy to production ✅
```

### Option B: Via Web UI
1. Go to https://vercel.com/dashboard
2. Select HERTZ project
3. Click "Deploy"
4. Confirm production deployment

---

## Post-Deploy Verification

### 1. Check Deployment Status
- [ ] Vercel shows "✅ Ready"
- [ ] Site loads at https://hertz.club
- [ ] No errors in Vercel logs

### 2. Test Live Site
```bash
# Test production endpoints
curl https://hertz.club/api/health

# Test HTTPS
curl -I https://hertz.club
# Should see: 301 → https://hertz.club (redirect from http)
```

### 3. Mobile Live Check
- [ ] Visit https://hertz.club on mobile
- [ ] Test all navigation
- [ ] Test all forms
- [ ] Verify images lazy load

### 4. SEO Verification
- [ ] Meta tags appear in page source
- [ ] og:image loads correctly
- [ ] JSON-LD valid (use https://validator.schema.org/)
- [ ] Robots.txt accessible: https://hertz.club/robots.txt
- [ ] Sitemap accessible: https://hertz.club/sitemap.xml

### 5. Performance Check
```bash
# Check Core Web Vitals via Google PageSpeed
# https://pagespeed.web.dev/?url=https://hertz.club

# Expected:
# - LCP: < 2.5s ✅
# - FID: < 100ms ✅
# - CLS: < 0.1 ✅
```

### 6. Browser Console
- [ ] Open DevTools (F12) → Console
- [ ] No red errors
- [ ] No warnings from CSP violations

---

## Environment Variables (If Using Backend)

When ready to add database + email:

### 1. Add to Vercel Dashboard
```
Go to: Vercel Dashboard → hertz-club → Settings → Environment Variables
Add:
  DATABASE_URL = mongodb+srv://...
  SENDGRID_API_KEY = SG_...
  (or RESEND_API_KEY)
```

### 2. Re-deploy
```bash
vercel --prod
```

### 3. Test
```bash
# Form submissions should now save to database
# Emails should send (check spam folder too)
```

---

## Rollback (If Needed)

### Revert to Previous Deployment
```bash
# In Vercel Dashboard:
# 1. Go to Deployments tab
# 2. Find last working deployment
# 3. Click "Promote to Production"
```

---

## Monitoring Setup

### Vercel Analytics
- Automatic (no setup needed)
- Check at: https://vercel.com/analytics

### Google Analytics (Optional)
1. Get GA4 Measurement ID from Google Analytics
2. Add script to index.html (see GA4_SETUP.html)
3. Test with: https://ga-dev-tools.web.app/event-builder/

---

## Success Criteria ✅

- [ ] Site loads under 2 seconds
- [ ] All pages accessible
- [ ] Mobile responsive works
- [ ] Forms functional (or ready for DB/email)
- [ ] No console errors
- [ ] SEO tags visible
- [ ] HTTPS working
- [ ] API endpoints responding

---

## Troubleshooting

### Site Won't Load
```
Check:
1. Vercel deployment status (green checkmark?)
2. Browser console for errors
3. Network tab in DevTools
4. Vercel logs: https://vercel.com/hertz-club/deployments
```

### 3D Scene Not Rendering
```
Check:
1. Three.js CDN loading (Network tab)
2. Browser WebGL support
3. Canvas element in DOM
4. Browser console for Three errors
```

### Forms Not Working
```
Check:
1. API routes deployed
2. Environment variables set
3. CORS headers in vercel.json
4. Browser network request to /api/*
5. API response in browser Network tab
```

---

## Final Sign-Off

**Deployed By**: ________________  
**Date**: ________________  
**Time**: ________________  
**Notes**: ________________  

✅ **HERTZ is LIVE**

---

For questions, see:
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)
- [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- [README.md](./README.md)
