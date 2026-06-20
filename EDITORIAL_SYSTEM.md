# 📰 HERTZ Editorial System — Complete Documentation

**Version**: 1.0  
**Last Updated**: May 27, 2026  
**Status**: ✅ Live & Ready

---

## 📋 Overview

The **HERTZ MEDIA** section is a curated editorial platform featuring in-depth articles about clubbing culture, sound design, and minimal music trends. It's not a "blog"—it's an editorial publication by the HERTZ team.

### Features
- ✅ 4 initial articles published
- ✅ Rich content with hero images, related articles, social sharing
- ✅ Full-text search ready (backend)
- ✅ SEO optimized (JSON-LD, Open Graph, meta tags)
- ✅ Mobile responsive
- ✅ Admin API for content management

### Content Types
1. **Reportage** — Venue coverage, event documentation, scene exploration
2. **Technical** — Deep dives into sound design, production, technology
3. **Editorial** — Opinion pieces, culture commentary, perspectives
4. **Trends** — Analysis of emerging sounds, scene movements, market trends

---

## 🏗️ Architecture

### Frontend
- **Page**: `/media.html` — Main editorial hub with article listings
- **Article Pages**: `/media/:slug.html` — Individual article detail pages
- **Components**: `hertz-editorial-components.jsx`
  - `ArticleCard` — Preview card for listings
  - `ArticleList` — Grid/list of articles with filtering
  - `ArticleDetail` — Full article + sidebar with related articles

### Backend
- **API**: `/api/articles.js` — Vercel serverless function
- **Database**: MongoDB (configured in `.env.local`)
- **Data Structure**: See schema below

### Deployment
- Vercel static hosting (HTML) + serverless functions (API)
- Rewrites in `vercel.json` for clean URLs
- Sitemap auto-generated for all articles

---

## 📊 Data Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  
  // Metadata
  slug: "inside-kindergarten-bologna", // Unique, URL-friendly
  title: "Inside Kindergarten: The Room That Changed Bologna",
  subtitle: "How one club became a blueprint for authentic clubbing",
  excerpt: "500 char summary for listings",
  
  // Content
  content: {
    body: "<h2>HTML or Markdown</h2><p>Full article content...</p>",
    readingTimeMinutes: 5
  },
  
  // Media
  media: {
    heroImage: "assets/article-kindergarten-hero.jpg",
    heroImageAlt: "Description for accessibility",
    gallery: [
      "assets/kindergarten-booth.jpg",
      "assets/kindergarten-crowd.jpg"
    ]
  },
  
  // Publishing
  metadata: {
    author: "HERTZ Redazione",
    category: "Reportage", // or Technical, Editorial, Trends
    tags: ["bologna", "venues", "culture"],
    publishedAt: ISODate("2026-05-15"),
    updatedAt: ISODate("2026-05-15")
  },
  
  // SEO
  seo: {
    metaDescription: "...",
    keywords: ["keyword1", "keyword2"]
  },
  
  // Engagement
  engagement: {
    shareCount: 0,
    viewCount: 0,
    featured: true // Show in featured section
  },
  
  // Cross-linking
  relatedArticles: ["physics-deep-tech-128bpm", "authenticity-modern-clubbing"]
}
```

---

## 🔌 API Endpoints

### GET `/api/articles`
Fetch articles with filtering.

**Query Parameters:**
- `category` — Filter by category (Reportage, Technical, Editorial, Trends)
- `featured` — Only featured articles (`?featured=true`)
- `tag` — Filter by tag (`?tag=bologna`)
- `page` — Pagination (`?page=1`)
- `limit` — Items per page (`?limit=10`)

**Response:**
```json
{
  "ok": true,
  "articles": [...],
  "total": 4,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### GET `/api/articles?slug=:slug`
Fetch single article with related articles.

**Response:**
```json
{
  "ok": true,
  "article": { ...full article object with relatedArticles populated... }
}
```

### POST `/api/articles` (Admin)
Create new article.

**Headers:**
```
X-API-Key: your-admin-key
Content-Type: application/json
```

**Body:**
```json
{
  "title": "New Article Title",
  "slug": "new-article-slug",
  "content": { "body": "...", "readingTimeMinutes": 5 },
  ...
}
```

### PATCH `/api/articles/:id` (Admin)
Update article.

### DELETE `/api/articles/:id` (Admin)
Delete article.

---

## 📝 How to Add Articles

### Option 1: Direct Database Insert (Easiest Now)

1. **Connect to MongoDB:**
   ```bash
   # Use MongoDB Compass or mongosh CLI
   mongodb+srv://username:password@cluster.mongodb.net/hertz
   ```

2. **Insert document:**
   ```javascript
   db.articles.insertOne({
     slug: "article-slug",
     title: "Article Title",
     subtitle: "Subtitle",
     excerpt: "Short summary...",
     content: {
       body: "<h2>HTML Content</h2>...",
       readingTimeMinutes: 5
     },
     media: {
       heroImage: "assets/image.jpg",
       heroImageAlt: "Description",
       gallery: []
     },
     metadata: {
       author: "Author Name",
       category: "Reportage",
       tags: ["tag1", "tag2"],
       publishedAt: new Date(),
       updatedAt: new Date()
     },
     seo: {
       metaDescription: "SEO description",
       keywords: ["keyword1"]
     },
     engagement: {
       shareCount: 0,
       viewCount: 0,
       featured: true
     },
     relatedArticles: ["other-article-slug"]
   })
   ```

### Option 2: API POST (When Backend Ready)

```bash
curl -X POST https://hertz.club/api/articles \
  -H "X-API-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{...article object...}'
```

### Option 3: Admin CMS (Coming Soon)

A dedicated admin interface for content management (Phase 2).

---

## 📱 Content Guidelines

### Writing
- **Title**: 50-70 characters, SEO-friendly
- **Subtitle**: 80-120 characters, compelling hook
- **Excerpt**: 150-200 characters for listing preview
- **Body**: 1,200-2,500 words for optimal engagement
- **Reading Time**: 4-8 minutes (1 min per 250 words)

### Categories
- **Reportage**: Event coverage, venue features, scene documentation
- **Technical**: Production, sound design, music technology
- **Editorial**: Opinion, culture commentary, perspectives
- **Trends**: Market analysis, emerging movements, forecasting

### Tags
Use lowercase, hyphen-separated:
- `bologna`, `venue`, `sound-design`, `culture`
- `deep-tech`, `minimal`, `production`
- `summer-2026`, `european-scene`

### SEO
- Meta description: 155-160 characters
- Keywords: 3-5 relevant terms
- URL slug: max 75 characters

---

## 📊 Current Articles

### 1. "Inside Kindergarten: The Room That Changed Bologna"
- **Slug**: `inside-kindergarten-bologna`
- **Category**: Reportage
- **Published**: May 15, 2026
- **Reading Time**: 5 min
- **Featured**: Yes

### 2. "The Physics of Deep Tech: Sound Design at 128 BPM"
- **Slug**: `physics-deep-tech-128bpm`
- **Category**: Technical
- **Published**: May 20, 2026
- **Reading Time**: 7 min
- **Featured**: Yes

### 3. "Authenticity in Modern Clubbing: Why It Still Matters"
- **Slug**: `authenticity-modern-clubbing`
- **Category**: Editorial
- **Published**: May 22, 2026
- **Reading Time**: 4 min
- **Featured**: Yes

### 4. "Summer 2026: What's Shaping the European Club Season"
- **Slug**: `summer-2026-trends`
- **Category**: Trends
- **Published**: May 26, 2026
- **Reading Time**: 6 min
- **Featured**: No

---

## 🎯 SEO Optimization

### Implemented
- ✅ Individual meta tags per article
- ✅ Open Graph tags (og:title, og:image, og:description)
- ✅ Article schema markup (article:author, article:published_time)
- ✅ Canonical URLs
- ✅ Sitemap entries
- ✅ Reading time estimation
- ✅ Image alt text

### Links in Sitemap
Each article appears in `sitemap.xml` with:
- `lastmod` — Publication date
- `changefreq` — "never" (articles don't change)
- `priority` — 0.8 (secondary to homepage)

### Search Console
1. Add `https://hertz.club/sitemap.xml` to Google Search Console
2. Monitor search performance for article keywords
3. Add articles to "News" coverage if applicable

---

## 🔐 Admin Access

### API Key Setup
1. Create a strong API key: `ADMIN_API_KEY=your-secret-key`
2. Store in Vercel environment variables
3. Use in `X-API-Key` header for POST/PATCH/DELETE

### Database Access
1. Get MongoDB connection string
2. Use MongoDB Compass GUI (easiest)
3. Or: MongoDB CLI (`mongosh`)
4. Or: MongoDB Atlas web dashboard

---

## 📱 Frontend Integration

### Article Listing Page
Located at `/media.html`:
- Shows featured articles first
- Grid layout (responsive)
- Filtering by category/tag
- Related articles sidebar

### Individual Article Pages
Example URLs:
- `https://hertz.club/media/inside-kindergarten-bologna.html`
- `https://hertz.club/media/physics-deep-tech-128bpm.html`
- `https://hertz.club/media/authenticity-modern-clubbing.html`
- `https://hertz.club/media/summer-2026-trends.html`

### Components Used
- `ArticleCard` — 3-column grid cards with image, title, meta
- `ArticleDetail` — Full-width article + sidebar
- `ArticleList` — Filtered/paginated listing

---

## 🚀 Publishing Workflow

### Create → Review → Publish

1. **Create**: Write in your editor of choice (Markdown or HTML)
2. **Review**: Share with team for feedback
3. **Publish**: Insert into MongoDB using Option 1 or 2 above
4. **Verify**: Check article appears on `/media.html`
5. **Promote**: Share on social media (Twitter, Instagram)

### Update Workflow
1. Modify document in MongoDB
2. Update `updatedAt` timestamp
3. Changes live immediately (no rebuild needed)

---

## 📊 Analytics Ready

### Tracking Available
- Article views (track via GA4 events)
- Social shares (Twitter, Instagram)
- Reading time tracking
- Scroll depth

### To Add GA4:
```javascript
// In ArticleDetail component
gtag('event', 'article_view', {
  article_slug: slug,
  article_title: article.title,
  article_category: article.metadata.category
});
```

---

## ⏱️ Performance

### Metrics
- Article page LCP: < 1.2s
- Hero image: Lazy loaded
- Related articles: Fetched server-side, cached
- Bundle size: ~50KB gzipped (per article page)

### Image Optimization
- Use Sharp script: `npm run optimize-images`
- Target sizes: 1200px wide for hero
- Format: JPG (high quality) or WebP (if supported)

---

## 🔮 Roadmap

### Phase 1 (Done ✅)
- Backend API structure
- 4 initial articles
- Frontend components
- SEO integration

### Phase 2 (Next)
- Admin CMS interface for content creation
- Editorial calendar view
- Draft/published states
- Author management
- Tags/category management UI

### Phase 3 (Future)
- Reader comments
- Newsletter integration
- Article recommendations (ML)
- Video embedding support
- Audio player for interviews

---

## 🆘 Troubleshooting

### Article Not Showing
1. Check slug matches exactly (case-sensitive)
2. Verify `publishedAt` is set and valid date
3. Check `featured: true` if should appear in main listing
4. Confirm tags are lowercase

### Images Not Loading
1. Check image path is correct (`assets/image.jpg`)
2. Verify image exists in `/assets/` folder
3. Check image size (recommend < 2MB)
4. Use `npm run optimize-images` to compress

### Related Articles Not Showing
1. Verify `relatedArticles` array contains valid slugs
2. Confirm related articles exist in database
3. Check spelling of slugs (case-sensitive)

### SEO Issues
1. Verify meta tags in HTML head
2. Check Open Graph image URL is accessible
3. Test with Google's Rich Result Tester
4. Submit sitemap to Search Console

---

## 📞 Support & Questions

- **Content questions**: hertz@hertz.club
- **Technical issues**: Check `/api/articles.js` logs
- **Deployment**: Check Vercel dashboard

---

## 📄 Files Reference

```
├── api/articles.js                      # Backend API
├── hertz-editorial-components.jsx       # React components
├── media.html                           # Editorial hub page
├── media/                               # Article detail pages
│   ├── inside-kindergarten-bologna.html
│   ├── physics-deep-tech-128bpm.html
│   ├── authenticity-modern-clubbing.html
│   └── summer-2026-trends.html
├── sitemap.xml                          # Updated with articles
└── EDITORIAL_SYSTEM.md                  # This file
```

---

**Status**: 🟢 LIVE & OPERATIONAL  
**Last Deploy**: May 27, 2026  
**Articles Published**: 4  
**Next Article Date**: TBD
