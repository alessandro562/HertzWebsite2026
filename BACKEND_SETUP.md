# HERTZ Backend Setup Guide

## 🚀 Current Status
- Frontend: ✅ Optimized (React production, CSS responsive, SEO ready)
- Backend: 📋 API routes created (Vercel serverless)
- Database: ⏳ Not yet configured
- Email: ⏳ Not yet configured

## 📋 Next Steps

### 1. Database Setup (Choose One)

#### Option A: MongoDB (Recommended)
```bash
npm install mongoose
```
- Create cluster at mongodb.com
- Get connection string
- Add to `.env.local`: `DATABASE_URL=mongodb+srv://...`

#### Option B: PostgreSQL
```bash
npm install pg
```
- Use Vercel Postgres or external host
- Create tables for: users, emails, events

### 2. Email Service (Choose One)

#### Option A: Resend (Easiest for serverless)
```bash
npm install resend
```
- Sign up at resend.com
- Get API key
- Add to `.env.local`: `RESEND_API_KEY=...`

#### Option B: SendGrid
```bash
npm install @sendgrid/mail
```
- Sign up at sendgrid.com
- Get API key
- Add to `.env.local`: `SENDGRID_API_KEY=...`

### 3. Update API Routes

Edit `/api/waitlist.js` to save to database:
```javascript
// Example with MongoDB
const email = req.body.email;
await Waitlist.create({ email, createdAt: new Date() });
```

### 4. Testing

```bash
# Test locally
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test on Vercel after deploy
curl -X POST https://hertz.club/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🔐 Security Checklist

- [ ] Add rate limiting to API routes
- [ ] Validate/sanitize all inputs
- [ ] Use HTTPS only (automatic on Vercel)
- [ ] Add CORS headers if needed
- [ ] Store secrets in `.env.local` (never commit)
- [ ] Set CSP headers in vercel.json ✅

## 📊 Monitoring

- Vercel Analytics: https://vercel.com/analytics
- Error tracking: Sentry (optional)
- Email logs: Check SendGrid/Resend dashboard
