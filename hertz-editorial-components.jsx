const { useState, useEffect } = React;

/* ─────────────────────────────────────────── */
/* ARTICLE CARD — Editorial text card */
/* ─────────────────────────────────────────── */
function ArticleCard({ article, featured = false }) {
  const C = window.Cv8;
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const briq = { fontFamily: "'Archivo', sans-serif" };
  const [hovered, setHovered] = useState(false);
  const [isWide, setIsWide] = useState(typeof window !== 'undefined' ? window.innerWidth >= 760 : true);

  useEffect(() => {
    const r = () => setIsWide(window.innerWidth >= 760);
    window.addEventListener('resize', r, { passive: true });
    return () => window.removeEventListener('resize', r);
  }, []);

  const date = new Date(article.metadata.publishedAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const img = article.image || (article.media && article.media.heroImage) || 'uploads/27.02_Hertz-9.jpg';
  const horizontal = featured && isWide;

  return (
    <a
      href={`/media/${article.slug}`}
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        textDecoration: 'none',
        color: 'inherit',
        background: C.dark,
        border: `1px solid ${C.dark}12`,
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(8,8,13,0.28)' : '0 2px 12px rgba(8,8,13,0.06)',
        transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s cubic-bezier(.22,1,.36,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE with overlaid title */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        flex: horizontal ? '0 0 56%' : 'none',
        aspectRatio: horizontal ? 'auto' : (featured ? '16/9' : '4/5'),
        minHeight: horizontal ? 420 : 'auto',
      }}>
        <img src={img} alt="" loading="lazy" style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          filter: hovered ? 'saturate(0.85) brightness(0.62)' : 'saturate(0.6) brightness(0.5) contrast(1.05)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(.22,1,.36,1), filter 0.5s',
        }} />
        {/* gradient for legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(8,8,13,0.92) 0%, rgba(8,8,13,0.45) 42%, rgba(8,8,13,0.1) 100%)',
        }} />
        {/* top meta row */}
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            ...mono, fontSize: 9, letterSpacing: '0.2em', fontWeight: 600,
            color: C.light, textTransform: 'uppercase',
            background: C.blue, padding: '5px 10px',
          }}>{article.metadata.category}</span>
          <span style={{
            ...mono, fontSize: 9, letterSpacing: '0.14em', color: C.light + 'cc',
            background: 'rgba(8,8,13,0.55)', padding: '5px 9px',
          }}>{article.content.readingTimeMinutes} MIN</span>
        </div>
        {/* title overlaid bottom */}
        <h3 style={{
          position: 'absolute', left: featured ? 28 : 22, right: featured ? 28 : 22, bottom: featured ? 26 : 20,
          ...briq,
          fontSize: featured ? 'clamp(1.7rem, 3vw, 2.7rem)' : 'clamp(1.25rem, 1.7vw, 1.55rem)',
          fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
          color: C.light, textWrap: 'pretty', margin: 0,
          textShadow: '0 2px 24px rgba(0,0,0,0.5)',
        }}>{article.title}</h3>
      </div>

      {/* BODY — summary + meta */}
      <div style={{
        flex: horizontal ? '1 1 44%' : '1 0 auto',
        background: C.light,
        padding: featured ? 'clamp(24px,3vw,40px)' : '22px 24px 24px',
        display: 'flex', flexDirection: 'column', justifyContent: horizontal ? 'center' : 'flex-start',
      }}>
        {article.subtitle && featured && (
          <div style={{ ...mono, fontSize: 10, letterSpacing: '0.16em', color: C.blue, marginBottom: 16, textTransform: 'uppercase' }}>
            {article.metadata.category} · Editorial
          </div>
        )}
        <p style={{
          ...briq, fontSize: featured ? 'clamp(15px,1.2vw,17px)' : 14,
          color: C.dark + 'aa', lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: featured ? 5 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.excerpt}
        </p>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: featured ? 28 : 18, paddingTop: 16,
          borderTop: `1px solid ${C.dark}12`,
        }}>
          <span style={{ ...mono, fontSize: 9, color: C.dark + '66', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {article.metadata.author} · {date}
          </span>
          <span style={{
            ...mono, fontSize: 10, letterSpacing: '0.14em', fontWeight: 600,
            color: hovered ? C.blue : C.dark + '88', transition: 'color 0.2s', whiteSpace: 'nowrap',
          }}>READ →</span>
        </div>
      </div>
    </a>
  );
}
window.ArticleCard = ArticleCard;

/* ─────────────────────────────────────────── */
/* ARTICLE LIST — used by media.html listing   */
/* ─────────────────────────────────────────── */
function ArticleList({ featured = false, limit = 10 }) {
  const C = window.Cv8;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = featured
      ? '/api/articles?featured=true&limit=' + limit
      : '/api/articles?limit=' + limit;
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.ok) setArticles(d.articles); else setError(d.error || 'Failed'); })
      .catch(() => setError('Error loading articles'))
      .finally(() => setLoading(false));
  }, [featured, limit]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: 120, background: C.darkSoft,
          animation: 'pulse 1.6s ease-in-out infinite',
          opacity: 1 - i * 0.15,
        }} />
      ))}
    </div>
  );
  if (error) return <div style={{ padding: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.light + '44' }}>{error}</div>;
  if (!articles.length) return <div style={{ padding: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.light + '44' }}>No articles yet.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {articles.map(a => <ArticleCard key={a.slug} article={a} featured={featured} />)}
    </div>
  );
}
window.ArticleList = ArticleList;

/* ─────────────────────────────────────────── */
/* ARTICLE DETAIL — full article page          */
/* ─────────────────────────────────────────── */
function ArticleDetail({ slug }) {
  const C = window.Cv8;
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const briq = { fontFamily: "'Archivo', sans-serif" };
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', r, { passive: true });
    return () => window.removeEventListener('resize', r);
  }, []);

  useEffect(() => {
    fetch(`/api/articles?slug=${slug}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setArticle(d.article); else setError(d.error || 'Not found'); })
      .catch(() => setError('Error loading article'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ height: 12, background: C.darkSoft, width: '30%', marginBottom: 40 }} />
      <div style={{ height: 56, background: C.darkSoft, width: '80%', marginBottom: 16 }} />
      <div style={{ height: 20, background: C.darkSoft, width: '60%', marginBottom: 48 }} />
      {[1,2,3,4].map(i => <div key={i} style={{ height: 16, background: C.darkSoft, width: `${70 + i * 5}%`, marginBottom: 10 }} />)}
    </div>
  );

  if (error || !article) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ ...mono, fontSize: 10, color: C.light + '44', letterSpacing: '0.2em', marginBottom: 16 }}>// 404</div>
      <p style={{ ...briq, fontSize: '1.2rem', color: C.light + '88' }}>{error || 'Article not found'}</p>
      <a href="/media.html" style={{ ...mono, fontSize: 11, color: C.blue, letterSpacing: '0.14em', marginTop: 24, display: 'inline-block' }}>← Back to Media</a>
    </div>
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const publishDate = new Date(article.metadata.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div>
      {/* Back nav */}
      <a href="/media.html" style={{
        ...mono, fontSize: 12, color: C.light + '44', letterSpacing: '0.16em',
        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
        marginBottom: 48, minHeight: 44, transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = C.blue}
      onMouseLeave={e => e.currentTarget.style.color = C.light + '44'}
      >
        ← MEDIA
      </a>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        gap: isMobile ? 48 : 80,
        maxWidth: 1200,
      }}>
        {/* MAIN */}
        <article>
          {/* Hero image */}
          {article.media && article.media.heroImage && (
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '16/9',
              overflow: 'hidden', marginBottom: 40,
            }}>
              <img src={article.media.heroImage} alt={article.media.heroImageAlt || ''} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'saturate(0.7) brightness(0.7) contrast(1.05)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(0deg, rgba(8,8,13,0.55) 0%, rgba(8,8,13,0.1) 60%)',
              }} />
            </div>
          )}
          {/* Article header */}
          <header style={{ marginBottom: 48, borderLeft: `3px solid ${C.blue}`, paddingLeft: 24 }}>
            <div style={{
              ...mono, fontSize: 10, letterSpacing: '0.22em',
              color: C.blue, textTransform: 'uppercase', fontWeight: 600,
              marginBottom: 16,
            }}>
              {article.metadata.category} · {article.content.readingTimeMinutes} min read
            </div>
            <h1 style={{
              ...briq,
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: C.light, marginBottom: 16,
            }}>
              {article.title}
            </h1>
            {article.subtitle && (
              <p style={{
                ...briq, fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
                color: C.light + 'bb', lineHeight: 1.45, fontWeight: 500,
              }}>
                {article.subtitle}
              </p>
            )}
          </header>

          {/* Body */}
          <div
            style={{
              ...briq,
              fontSize: 'clamp(15px, 1.05vw, 17px)',
              lineHeight: 1.85,
              color: C.light + 'cc',
            }}
            dangerouslySetInnerHTML={{ __html: article.content.body }}
          />

          {/* Footer */}
          <footer style={{
            borderTop: `1px solid ${C.light}12`,
            paddingTop: 32, marginTop: 56,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ ...mono, fontSize: 9, color: C.light + '55', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
                {article.metadata.author}
              </div>
              <div style={{ ...mono, fontSize: 9, color: C.light + '44' }}>{publishDate}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleCopyLink} style={{
                ...mono, fontSize: 10, padding: '12px 18px',
                background: 'transparent',
                border: `1px solid ${C.light}22`,
                color: copied ? C.blue : C.light + '55',
                cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'all 0.2s', minHeight: 44,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.light + '22'; e.currentTarget.style.color = copied ? C.blue : C.light + '55'; }}
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </footer>
        </article>

        {/* SIDEBAR */}
        <aside style={{ position: isMobile ? 'static' : 'sticky', top: 100, height: 'fit-content' }}>
          {/* Related */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div style={{ borderTop: `2px solid ${C.blue}`, paddingTop: 20, marginBottom: 32 }}>
              <div style={{ ...mono, fontSize: 9, letterSpacing: '0.22em', color: C.blue, marginBottom: 20, textTransform: 'uppercase' }}>
                // Also read
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {article.relatedArticles.map(rel => (
                  <a key={rel.slug} href={`/media/${rel.slug}`} style={{
                    textDecoration: 'none', color: 'inherit',
                    padding: '14px 0',
                    borderBottom: `1px solid ${C.light}0a`,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.blue}
                  onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                  >
                    <div style={{ ...mono, fontSize: 10, color: C.blue, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {rel.metadata ? rel.metadata.category : ''}
                    </div>
                    <div style={{ ...briq, fontSize: 13, fontWeight: 700, lineHeight: 1.25, color: C.light + 'cc' }}>
                      {rel.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <a href="/media.html" style={{
            ...mono, fontSize: 10, color: C.light + '33',
            textDecoration: 'none', letterSpacing: '0.14em',
            display: 'block', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.light}
          onMouseLeave={e => e.currentTarget.style.color = C.light + '33'}
          >
            ← All articles
          </a>
        </aside>
      </div>
    </div>
  );
}
window.ArticleDetail = ArticleDetail;
