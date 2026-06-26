const { useState, useEffect, useRef } = React;

/* ============================================================
   HERTZ — Editorial components
   Brand tokens (Helvetica Neue + JetBrains Mono + blue #144889)
   applied to the editorial design principles:
   - asymmetric index (lead + cards), kicker rubrics
   - house-style duotone images, restrained signal
   - reading-progress WAVEFORM (the signature)
   - narrow reading column, drop cap, breakout pull quotes
   ============================================================ */

const MONO = { fontFamily: "'JetBrains Mono', monospace" };
const HN = { fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif" };

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fmtDate(d, long) {
  return new Date(d).toLocaleDateString('en-GB', long
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' });
}

/* House-style duotone for all editorial photography */
const DUOTONE_REST = 'saturate(0.45) brightness(0.6) contrast(1.08)';
const DUOTONE_HOVER = 'saturate(0.95) brightness(0.8) contrast(1.0)';

/* ─────────────────────────────────────────── */
/* HOVER WAVE — the card micro-interaction      */
/* ─────────────────────────────────────────── */
function CardWave({ active }) {
  const C = window.Cv8;
  const N = 32;
  return (
    <div aria-hidden="true" style={{
      display: 'flex', alignItems: 'center', gap: 2, height: 10,
      width: active ? '100%' : '0%',
      overflow: 'hidden',
      opacity: active ? 1 : 0,
      transition: 'width 0.45s cubic-bezier(.22,1,.36,1), opacity 0.3s',
    }}>
      {Array.from({ length: N }).map((_, i) => {
        const amp = 0.25 + Math.abs(Math.sin(i * 0.7)) * 0.75;
        return <span key={i} style={{
          flex: 1, height: `${amp * 100}%`, minWidth: 1,
          background: C.blue, borderRadius: 1,
        }} />;
      })}
    </div>
  );
}

/* ─────────────────────────────────────────── */
/* READING PROGRESS — waveform that "plays"     */
/* (the signature — only on the article page)   */
/* ─────────────────────────────────────────── */
function ReadingProgress() {
  const C = window.Cv8;
  const [pct, setPct] = useState(0);
  const reduce = prefersReducedMotion();

  useEffect(() => {
    const getPct = () => {
      const doc = document.documentElement;
      const body = document.body;
      const top = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      const full = (doc.scrollHeight || body.scrollHeight) - window.innerHeight;
      return full > 0 ? Math.min(1, Math.max(0, top / full)) : 0;
    };
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { setPct(getPct()); raf = null; });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.body.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (reduce) {
    return (
      <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 300, background: 'rgba(245,245,243,0.08)' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: C.blue }} />
      </div>
    );
  }

  const N = 170;
  const playhead = pct * N;
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 8, zIndex: 300,
      display: 'flex', alignItems: 'center',
      background: 'rgba(8,8,13,0.55)', backdropFilter: 'blur(4px)',
      padding: '0 2px',
    }}>
      {Array.from({ length: N }).map((_, i) => {
        const amp = 0.28 + Math.abs(Math.sin(i * 0.5)) * 0.5 + ((i * 13) % 7) / 22;
        const played = i <= playhead;
        const atHead = Math.abs(i - playhead) < 1.2;
        return <span key={i} style={{
          flex: 1, margin: '0 0.5px', borderRadius: 1,
          height: `${Math.min(1, amp) * 100}%`,
          background: played ? C.blue : 'rgba(245,245,243,0.12)',
          boxShadow: atHead ? `0 0 6px ${C.blue}` : 'none',
          transition: 'background 0.15s linear',
        }} />;
      })}
    </div>
  );
}
window.ReadingProgress = ReadingProgress;

/* ─────────────────────────────────────────── */
/* ARTICLE CARD — editorial, borderless         */
/* lead = large feature; otherwise compact       */
/* dark = card sits on a dark background          */
/* ─────────────────────────────────────────── */
function ArticleCard({ article, featured = false, dark = false }) {
  const C = window.Cv8;
  const [hovered, setHovered] = useState(false);
  const [isWide, setIsWide] = useState(typeof window !== 'undefined' ? window.innerWidth >= 820 : true);

  useEffect(() => {
    const r = () => setIsWide(window.innerWidth >= 820);
    window.addEventListener('resize', r, { passive: true });
    return () => window.removeEventListener('resize', r);
  }, []);

  const img = article.image || (article.media && article.media.heroImage) || 'uploads/27.02_Hertz-9.jpg';
  const horizontal = featured && isWide;

  const ink = dark ? C.light : C.dark;
  const dim = (dark ? '236,234,227' : '8,8,13');
  const textDim = `rgba(${dim},0.62)`;
  const textMute = `rgba(${dim},0.45)`;
  const hairline = `rgba(${dim},0.14)`;

  const cat = (article.metadata && article.metadata.category ? article.metadata.category : 'Editorial').toUpperCase();
  const rt = article.content && article.content.readingTimeMinutes;

  return (
    <a
      href={`/media/${article.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: horizontal ? '1.15fr 1fr' : '1fr',
        gap: horizontal ? 'clamp(24px,3vw,48px)' : 18,
        alignItems: horizontal ? 'center' : 'stretch',
        textDecoration: 'none', color: 'inherit',
        height: '100%',
      }}
    >
      {/* IMAGE — house duotone */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: horizontal ? '3/2' : (featured ? '16/9' : '4/5'),
        background: dark ? '#0e0e16' : '#dcdcd6',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)',
      }}>
        <img src={img} alt="" loading="lazy" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: hovered ? DUOTONE_HOVER : DUOTONE_REST,
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(.22,1,.36,1), filter 0.5s ease',
        }} />
        {/* faint blue duotone wash toward ink */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(180deg, rgba(20,72,137,0.06), rgba(8,8,13,0.28))`,
          opacity: hovered ? 0.5 : 1, transition: 'opacity 0.5s',
        }} />
      </div>

      {/* TEXT */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: horizontal ? 'center' : 'flex-start' }}>
        <div style={{ ...MONO, fontSize: 10, letterSpacing: '0.22em', fontWeight: 600, color: C.blue, textTransform: 'uppercase', marginBottom: featured ? 14 : 10 }}>
          {cat}
        </div>
        <h3 style={{
          ...HN, margin: 0, color: ink, textWrap: 'pretty',
          fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05,
          fontSize: featured ? 'clamp(1.8rem, 3.4vw, 3rem)' : 'clamp(1.2rem, 1.7vw, 1.5rem)',
        }}>{article.title}</h3>

        {featured && article.subtitle && (
          <p style={{ ...HN, fontSize: 'clamp(15px,1.2vw,18px)', color: textDim, lineHeight: 1.5, marginTop: 16, marginBottom: 0, maxWidth: '46ch', textWrap: 'pretty' }}>
            {article.subtitle}
          </p>
        )}

        {/* signature hover wave */}
        <div style={{ marginTop: featured ? 20 : 14, marginBottom: featured ? 18 : 12, height: 10 }}>
          <CardWave active={hovered} />
        </div>

        <div style={{ ...MONO, fontSize: 10, letterSpacing: '0.12em', color: textMute, textTransform: 'uppercase' }}>
          {article.metadata.author} · {fmtDate(article.metadata.publishedAt)}{rt ? ` · ${rt} MIN` : ''}
        </div>
      </div>
    </a>
  );
}
window.ArticleCard = ArticleCard;

/* ─────────────────────────────────────────── */
/* ARTICLE LIST (fetches API) — kept for compat */
/* ─────────────────────────────────────────── */
function ArticleList({ featured = false, limit = 10, dark = false }) {
  const C = window.Cv8;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = featured ? '/api/articles?featured=true&limit=' + limit : '/api/articles?limit=' + limit;
    fetch(url).then(r => r.json())
      .then(d => { if (d.ok) setArticles(d.articles); else setError(d.error || 'Failed'); })
      .catch(() => setError('Error loading articles'))
      .finally(() => setLoading(false));
  }, [featured, limit]);

  if (loading) return <div style={{ ...MONO, fontSize: 11, color: (dark ? C.light : C.dark) + '44', padding: 32 }}>Loading…</div>;
  if (error) return <div style={{ ...MONO, fontSize: 11, color: (dark ? C.light : C.dark) + '44', padding: 32 }}>{error}</div>;
  if (!articles.length) return <div style={{ ...MONO, fontSize: 11, color: (dark ? C.light : C.dark) + '44', padding: 32 }}>No articles yet.</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'clamp(28px,3vw,48px)' }}>
      {articles.map(a => <ArticleCard key={a.slug} article={a} dark={dark} />)}
    </div>
  );
}
window.ArticleList = ArticleList;

/* ─────────────────────────────────────────── */
/* ARTICLE DETAIL — reading-first article page  */
/* ─────────────────────────────────────────── */
function ArticleDetail({ slug }) {
  const C = window.Cv8;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/articles?slug=${slug}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setArticle(d.article); else setError(d.error || 'Not found'); })
      .catch(() => setError('Error loading article'))
      .finally(() => setLoading(false));
  }, [slug]);

  /* SEO: title, meta description, OG, JSON-LD */
  useEffect(() => {
    if (!article) return;
    const prevTitle = document.title;
    document.title = `${article.title} — HERTZ`;

    const setMeta = (sel, attr, val) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        const [a, v] = sel.replace(/meta\[|\]/g, '').split('=');
        el.setAttribute(a, v.replace(/["']/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
      return el;
    };
    const desc = (article.seo && article.seo.metaDescription) || article.excerpt || '';
    const hero = article.media && article.media.heroImage ? `https://hertzclubbing.com${article.media.heroImage}` : '';
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', article.title);
    setMeta('meta[property="og:description"]', 'content', desc);
    if (hero) setMeta('meta[property="og:image"]', 'content', hero);
    setMeta('meta[name="twitter:title"]', 'content', article.title);
    setMeta('meta[name="twitter:description"]', 'content', desc);

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'ld-article';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: desc,
      image: hero || undefined,
      author: { '@type': 'Organization', name: article.metadata.author },
      publisher: { '@type': 'Organization', name: 'HERTZ' },
      datePublished: new Date(article.metadata.publishedAt).toISOString(),
      dateModified: new Date(article.metadata.updatedAt || article.metadata.publishedAt).toISOString(),
      mainEntityOfPage: window.location.href,
    });
    const old = document.getElementById('ld-article');
    if (old) old.remove();
    document.head.appendChild(ld);

    return () => { document.title = prevTitle; const e = document.getElementById('ld-article'); if (e) e.remove(); };
  }, [article]);

  if (loading) return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ height: 12, background: '#13131c', width: '30%', marginBottom: 40 }} />
      <div style={{ height: 56, background: '#13131c', width: '85%', marginBottom: 16 }} />
      <div style={{ height: 20, background: '#13131c', width: '60%', marginBottom: 48 }} />
      {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 16, background: '#13131c', width: `${70 + i * 5}%`, marginBottom: 12 }} />)}
    </div>
  );

  if (error || !article) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ ...MONO, fontSize: 10, color: C.light + '44', letterSpacing: '0.2em', marginBottom: 16 }}>// 404</div>
      <p style={{ ...HN, fontSize: '1.2rem', color: C.light + '88' }}>{error || 'Article not found'}</p>
      <a href="/media.html" style={{ ...MONO, fontSize: 11, color: C.blue, letterSpacing: '0.14em', marginTop: 24, display: 'inline-block' }}>← Back to Editorial</a>
    </div>
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const warm = 'rgba(236,234,227,'; // warm off-white, never pure white
  const READ = 720;

  return (
    <>
      <ReadingProgress />

      {/* Reading column */}
      <div style={{ maxWidth: READ, margin: '0 auto' }}>
        <a href="/media.html" style={{
          ...MONO, fontSize: 11, color: C.light + '44', letterSpacing: '0.18em',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          marginBottom: 40, minHeight: 44, textTransform: 'uppercase', transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.blue}
        onMouseLeave={e => e.currentTarget.style.color = C.light + '44'}
        >← Editorial</a>

        <article>
          {/* HERO */}
          {article.media && article.media.heroImage && (
            <figure style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', margin: '0 0 40px' }}>
              <img src={article.media.heroImage} alt={article.media.heroImageAlt || ''} fetchpriority="high"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.55) brightness(0.72) contrast(1.05)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,72,137,0.05), rgba(8,8,13,0.4))' }} />
            </figure>
          )}

          {/* HEADER */}
          <header style={{ marginBottom: 40 }}>
            <div style={{ ...MONO, fontSize: 11, letterSpacing: '0.24em', color: C.blue, textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>
              {article.metadata.category}
            </div>
            <h1 style={{ ...HN, fontSize: 'clamp(2.1rem, 5vw, 3.4rem)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', color: C.light, margin: 0 }}>
              {article.title}
            </h1>
            {article.subtitle && (
              <p style={{ ...HN, fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)', color: warm + '0.62)', lineHeight: 1.5, fontWeight: 400, marginTop: 20 }}>
                {article.subtitle}
              </p>
            )}
            <div style={{ ...MONO, fontSize: 10, letterSpacing: '0.14em', color: warm + '0.45)', textTransform: 'uppercase', marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span>{article.metadata.author}</span><span style={{ color: C.blue }}>·</span>
              <time dateTime={new Date(article.metadata.publishedAt).toISOString().slice(0, 10)}>{fmtDate(article.metadata.publishedAt, true)}</time>
              {article.content.readingTimeMinutes ? (<><span style={{ color: C.blue }}>·</span><span>{article.content.readingTimeMinutes} min read</span></>) : null}
            </div>
          </header>

          {/* BODY */}
          <div className="article-body" style={{ ...HN }} dangerouslySetInnerHTML={{ __html: article.content.body }} />

          {/* BYLINE / SHARE */}
          <footer style={{ borderTop: `1px solid rgba(236,234,227,0.12)`, paddingTop: 28, marginTop: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ ...MONO, fontSize: 10, color: warm + '0.62)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>{article.metadata.author}</div>
              <div style={{ ...MONO, fontSize: 10, color: warm + '0.42)' }}>{fmtDate(article.metadata.publishedAt, true)}</div>
            </div>
            <button onClick={handleCopyLink} style={{
              ...MONO, fontSize: 10, padding: '12px 18px', background: 'transparent',
              border: `1px solid rgba(236,234,227,0.22)`, color: copied ? C.blue : warm + '0.55)',
              cursor: 'pointer', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'all 0.2s', minHeight: 44,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(236,234,227,0.22)'; e.currentTarget.style.color = copied ? C.blue : warm + '0.55)'; }}
            >{copied ? 'Link copied' : 'Share'}</button>
          </footer>
        </article>
      </div>

      {/* KEEP READING — related, full editorial system */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section style={{ maxWidth: 1100, margin: '96px auto 0', borderTop: `1px solid rgba(236,234,227,0.1)`, paddingTop: 48 }}>
          <div style={{ ...MONO, fontSize: 11, letterSpacing: '0.24em', color: C.blue, textTransform: 'uppercase', marginBottom: 36 }}>Keep reading</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(28px,3vw,48px)' }}>
            {article.relatedArticles.map(rel => <ArticleCard key={rel.slug} article={rel} dark={true} />)}
          </div>
        </section>
      )}
    </>
  );
}
window.ArticleDetail = ArticleDetail;
