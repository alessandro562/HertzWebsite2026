// /api/media-page.js — Vercel Serverless Function
// Server-renders /media/:slug (see vercel.json rewrite) so the article's
// title, meta description, Open Graph, canonical and Article JSON-LD are
// correct per-slug in the RAW HTML — not only set client-side via JS.
//
// Why this exists: the previous setup pointed /media/:slug at one static
// HTML file (media-article-template.html) shared by every article, with
// React fetching the real content client-side. Search engines that run
// JS (Googlebot) saw the right page eventually, but crawlers that only
// read raw HTML (many AI/LLM crawlers) saw the same generic boilerplate
// for every article, and no body text at all. This renders the real
// title/description/OG/JSON-LD and the full article body as plain HTML
// up front, then hands off to the existing React app (same look, same
// "Keep reading"/share button behaviour) using the embedded data below
// instead of re-fetching it.

import { ARTICLES } from './articles.js';

const BASE = 'https://hertzclubbing.com';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STYLE_BLOCK = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
  body { background: #08080d; color: #f5f5f3; font-family: 'HelveticaNeue', 'Helvetica Neue', Helvetica, Arial, sans-serif; overflow-x: hidden; }
  @media (max-width: 768px) { * { -webkit-tap-highlight-color: transparent; } html { font-size: 14px; } body { font-size: 14px; } input, textarea, select { font-size: 16px; } }
  @media (max-width: 480px) { html { font-size: 13px; } }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #08080d; } ::-webkit-scrollbar-thumb { background: rgba(20,72,137,0.4); } ::selection { background: rgba(20,72,137,0.30); }
  img { user-select: none; max-width: 100%; height: auto; } a { color: inherit; text-decoration: none; }
  .article-body { color: rgba(236,234,227,0.86); font-size: clamp(18px, 0.6vw + 16px, 20px); line-height: 1.7; letter-spacing: -0.005em; }
  .article-body p { margin: 0 0 1.4em; } .article-body strong { font-weight: 700; color: #f3f1ea; } .article-body em { font-style: italic; }
  .article-body > p:first-of-type::first-letter { float: left; font-size: 3.6em; line-height: 0.74; font-weight: 800; padding: 6px 14px 0 0; color: #f5f5f3; font-family: 'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif; }
  .article-body h2 { font-size: clamp(1.5rem, 3vw, 2rem); margin: 2em 0 0.6em; font-weight: 700; line-height: 1.12; letter-spacing: -0.03em; color: #f5f5f3; }
  .article-body h3 { font-size: clamp(1.25rem, 2vw, 1.5rem); margin: 1.6em 0 0.5em; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; color: #f5f5f3; }
  .article-body blockquote { margin: 2.2em 0; padding-left: 22px; border-left: 3px solid #144889; font-size: clamp(1.5rem, 2.6vw, 2.05rem); font-weight: 700; line-height: 1.22; letter-spacing: -0.02em; color: #f5f5f3; font-style: normal; }
  .article-body blockquote p { margin: 0; }
  @media (min-width: 1040px) { .article-body blockquote { margin-left: -130px; padding-left: 28px; max-width: calc(100% + 130px); } }
  .article-body figure { margin: 2.4em 0; } .article-body figure img { width: 100%; display: block; filter: saturate(0.55) brightness(0.8) contrast(1.04); }
  .article-body figcaption { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: rgba(236,234,227,0.42); margin-top: 10px; }
`;

function renderNotFound(slug) {
  const title = 'Article not found — Hertz Clubbing Collective';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/assets/favicon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<title>${title}</title>
<meta name="description" content="L'articolo che cerchi non esiste o è stato rimosso. Scopri l'editoriale di Hertz su hertzclubbing.com/media.">
<meta name="robots" content="noindex">
<link rel="stylesheet" href="/fonts.css">
<style>${STYLE_BLOCK}</style>
</head>
<body>
  <main style="max-width:720px;margin:0 auto;padding:clamp(48px,8vh,96px) clamp(20px,4vw,56px)">
    <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.2em;color:rgba(245,245,243,0.4)">// 404</p>
    <h1 style="font-family:'HelveticaNeue','Helvetica Neue',Helvetica,sans-serif;font-size:2rem;margin-top:16px">Article not found.</h1>
    <p style="margin-top:16px;color:rgba(236,234,227,0.7)">"${esc(slug || '')}" doesn't match anything in the Hertz editorial.</p>
    <a href="/media.html" style="display:inline-block;margin-top:24px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#144889">← Back to Editorial</a>
  </main>
</body>
</html>`;
}

export default async function handler(req, res) {
  const slugParam = req.query.slug;
  let slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  if (slug && slug.endsWith('.html')) slug = slug.slice(0, -5); // tolerate old bookmarked .html links
  const article = slug && ARTICLES.find(a => a.slug === slug);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

  if (!article) {
    res.status(404);
    return res.send(renderNotFound(slug));
  }

  const canonical = `${BASE}/media/${article.slug}`;
  const desc = (article.seo && article.seo.metaDescription) || article.excerpt || '';
  const heroImg = (article.media && article.media.heroImage) ? `${BASE}${article.media.heroImage}` : `${BASE}/assets/hertz-logo-official.png`;
  const published = new Date(article.metadata.publishedAt).toISOString();
  const modified = new Date(article.metadata.updatedAt || article.metadata.publishedAt).toISOString();
  const title = `${article.title} — Hertz Clubbing Collective`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: desc,
    image: heroImg,
    author: { '@type': 'Organization', name: article.metadata.author },
    publisher: { '@type': 'Organization', name: 'Hertz Clubbing Collective', logo: { '@type': 'ImageObject', url: `${BASE}/assets/hertz-logo-official.png` } },
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: canonical,
  };
  if (article.metadata.tags && article.metadata.tags.length) jsonLd.keywords = article.metadata.tags.join(', ');

  const relatedArticles = (article.relatedArticles || [])
    .map(s => ARTICLES.find(a => a.slug === s))
    .filter(Boolean)
    .map(({ slug, title, subtitle, excerpt, metadata, content, media }) => ({
      slug, title, subtitle, excerpt, metadata,
      content: { readingTimeMinutes: content.readingTimeMinutes },
      image: media && media.heroImage,
    }));

  const embedPayload = JSON.stringify({ ...article, relatedArticles }).replace(/<\/script/gi, '<\\/script');

  const bylineDate = new Date(article.metadata.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/assets/favicon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Hertz Clubbing Collective">
<meta property="og:title" content="${esc(article.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${heroImg}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="it_IT">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(article.title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${heroImg}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<link rel="stylesheet" href="/fonts.css">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=block" rel="stylesheet">
<style>${STYLE_BLOCK}</style>
</head>
<body>
  <div id="root">
    <div style="background:#08080d;min-height:100vh">
      <main style="padding:clamp(48px,8vh,96px) clamp(20px,4vw,56px);max-width:1400px;margin:0 auto">
        <div style="max-width:720px;margin:0 auto">
          <a href="/media.html" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(245,245,243,0.27);letter-spacing:0.18em;text-decoration:none;text-transform:uppercase">← Editorial</a>
          ${article.media && article.media.heroImage ? `<figure style="margin:24px 0 32px"><img src="${esc(article.media.heroImage)}" alt="${esc(article.media.heroImageAlt || '')}" style="width:100%;display:block;filter:saturate(0.55) brightness(0.72) contrast(1.05)"></figure>` : ''}
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.22em;color:#144889;text-transform:uppercase;font-weight:600;margin-bottom:16px">${article.metadata.rubric ? `// ${esc(article.metadata.rubric)} · ${esc(article.metadata.category)}` : `// ${esc(article.metadata.category)}`}</div>
          <h1 style="font-family:'HelveticaNeue','Helvetica Neue',Helvetica,sans-serif;font-size:clamp(2.1rem,5vw,3.4rem);font-weight:700;line-height:1.04;letter-spacing:-0.035em;color:#f5f5f3;margin:0">${esc(article.title)}<span style="color:#144889">.</span></h1>
          ${article.subtitle ? `<p style="font-family:'HelveticaNeue','Helvetica Neue',Helvetica,sans-serif;font-size:clamp(1.05rem,1.6vw,1.35rem);color:rgba(236,234,227,0.62);line-height:1.5;margin-top:18px">${esc(article.subtitle)}</p>` : ''}
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;color:rgba(236,234,227,0.45);text-transform:uppercase;margin-top:22px">${esc(article.metadata.author)} · ${esc(bylineDate)}${article.content.readingTimeMinutes ? ` · ${article.content.readingTimeMinutes} min read` : ''}</div>
          <div class="article-body" style="margin-top:36px">${article.content.body}</div>
        </div>
      </main>
    </div>
  </div>

  <script id="article-data" type="application/json">${embedPayload}</script>

  <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>

  <script type="text/babel" src="/hertz-shared.jsx"></script>
  <script type="text/babel" src="/hertz-editorial-components.jsx"></script>

  <script type="text/babel">
    const slug = window.location.pathname.split('/').pop().replace('.html', '');

    function ArticlePage() {
      const C = window.Cv8;
      return (
        <div style={{ background: C.dark, minHeight: '100vh' }}>
          <window.Nav8 />
          <main style={{ padding: 'clamp(48px, 8vh, 96px) clamp(20px, 4vw, 56px)', maxWidth: 1400, margin: '0 auto' }}>
            <window.ArticleDetail slug={slug} />
          </main>
          <window.Footer8 />
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<ArticlePage />);
  </script>
</body>
</html>`;

  return res.status(200).send(html);
}
