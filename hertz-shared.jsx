/* ============================================
   HERTZ — Shared components for sub-pages
   Nav8 · Footer8 · PageHero · Cv8 · R8
   ============================================ */

/* Inject global focus-visible styles once */
(function() {
  if (document.getElementById('hz-global-styles')) return;
  const s = document.createElement('style');
  s.id = 'hz-global-styles';
  s.textContent = `
    :focus-visible {
      outline: 2px solid #144889;
      outline-offset: 2px;
    }
    a:focus-visible, button:focus-visible {
      outline: 2px solid #144889;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(s);
})();

const Cv8 = {
  dark: '#08080d', darkSoft: '#15151d',
  light: '#f5f5f3', lightSoft: '#e8e8e3',
  gray: '#9a9a9f', cyan: '#00d4ff',
  yellow: '#f5f00d', blue: '#144889',
};
window.Cv8 = Cv8;

function useInView(threshold = 0.08) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}
window.useInView = useInView;

function R8({ children, delay = 0, y = 50, style = {}, className = '' }) {
  const [ref, vis] = useInView(0.06);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 1.1s cubic-bezier(.22,1,.36,1) ${delay}s, transform 1.1s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}
window.R8 = R8;

/* ─── Nav ──────────────────────────────────── */
function Nav8() {
  const C = Cv8;
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    const r = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener('scroll', h, { passive: true });
    window.addEventListener('resize', r, { passive: true });
    r();
    return () => {
      window.removeEventListener('scroll', h);
      window.removeEventListener('resize', r);
    };
  }, []);

  /* close menu on escape */
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = [
    { label: 'Events',    href: '/events.html' },
    { label: 'Manifesto', href: '/manifesto.html' },
    { label: 'Artists',   href: '/artists.html' },
    { label: 'Music',     href: '/music.html' },
    { label: 'Merch',     href: '/merch.html' },
    { label: 'Media',     href: '/media.html' },
  ];

  const path = typeof location !== 'undefined' ? location.pathname : '/';
  const filename = path.split('/').pop();
  const isActive = (href) => {
    const target = href.replace('/', '');
    if (filename === target) return true;
    /* highlight Media for any article page under /media/ */
    if (href === '/media.html' && path.startsWith('/media/')) return true;
    return false;
  };

  return (
    <>
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(20px, 4vw, 56px)', height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: menuOpen ? 'transparent' : C.dark,
      borderBottom: `1px solid ${scrolled && !menuOpen ? C.light + '14' : 'transparent'}`,
      transition: 'all 0.4s cubic-bezier(.22,1,.36,1)',
    }}>
      <a href="/index.html" style={{ textDecoration: 'none', zIndex: 101 }}>
        <img src="/assets/hertz-logo-header.png" alt="HERTZ" style={{ height: 36, opacity: 0.95 }} />
      </a>

      {isMobile ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background: 'none', border: 'none', outline: 'none', color: C.light,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
            cursor: 'pointer', zIndex: 101, padding: 8,
            minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 'clamp(14px, 2.2vw, 28px)', alignItems: 'center' }}>
          {items.map(item => {
            const active = isActive(item.href);
            return (
              <a key={item.label} href={item.href} style={{
                color: active ? C.light : C.light + 'aa',
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', transition: 'color 0.18s, transform 0.18s',
                display: 'inline-block',
                borderBottom: active ? `1px solid ${C.blue}` : '1px solid transparent',
                paddingBottom: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = active ? C.light : C.light + 'aa'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >{item.label}</a>
            );
          })}
          <a
            href="#"
            aria-label="Buy tickets for the next event"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
              background: 'transparent', color: C.light,
              border: `1px solid ${C.light}33`,
              padding: '10px 18px', cursor: 'pointer',
              textTransform: 'uppercase', transition: 'all 0.2s',
              textDecoration: 'none', display: 'inline-block',
              outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.light + '33'; e.currentTarget.style.color = C.light; }}
          >Tickets ↗</a>
        </div>
      )}
    </nav>

    {/* Mobile overlay menu */}
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: 'rgba(8, 8, 13, 0.98)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        gap: 32,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }}
    >
      {items.map((item, i) => (
        <a
          key={item.label}
          href={item.href}
          onClick={() => setMenuOpen(false)}
          style={{
            color: C.light, textDecoration: 'none',
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700,
            letterSpacing: '-0.04em',
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s cubic-bezier(.22,1,.36,1) ${i * 0.05}s`,
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.blue}
          onMouseLeave={e => e.currentTarget.style.color = C.light}
        >{item.label}</a>
      ))}
      <a
        href="#"
        aria-label="Buy tickets"
        style={{
          marginTop: 24, display: 'inline-block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, fontWeight: 600, letterSpacing: '0.16em',
          background: C.blue, color: C.light,
          border: 'none', padding: '14px 32px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: `all 0.4s cubic-bezier(.22,1,.36,1) ${items.length * 0.05}s`,
        }}
      >Tickets ↗</a>
    </div>
    </>
  );
}
window.Nav8 = Nav8;

/* ─── PageHero ─────────────────────────────── */
function PageHero({ section, title, sub, light = false }) {
  const C = Cv8;
  const bg = light ? C.light : C.dark;
  const fg = light ? C.dark : C.light;
  return (
    <section style={{
      background: bg, color: fg,
      padding: 'clamp(110px, 18vh, 160px) clamp(20px, 4vw, 56px) clamp(56px, 10vh, 96px)',
      position: 'relative', overflow: 'hidden',
      backgroundImage: `linear-gradient(${fg}04 1px,transparent 1px),linear-gradient(90deg,${fg}04 1px,transparent 1px)`,
      backgroundSize: '40px 40px',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '0.2em', color: C.blue, marginBottom: 16,
      }}>{section}</div>
      <h1 style={{
        fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
        fontSize: 'clamp(3rem, 10vw, 9rem)',
        fontWeight: 700, lineHeight: 0.83,
        letterSpacing: '-0.05em', color: fg,
        whiteSpace: 'pre-line',
      }}>{title}<span style={{ color: C.blue }}>.</span></h1>
      {sub && (
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, color: fg + '66', letterSpacing: '0.15em',
          textTransform: 'uppercase', marginTop: 20,
        }}>{sub}</p>
      )}
    </section>
  );
}
window.PageHero = PageHero;

/* ─── Footer ───────────────────────────────── */
function Footer8() {
  const C = Cv8;
  return (
    <footer style={{
      background: C.dark, color: C.light,
      padding: 'clamp(60px,10vh,100px) clamp(20px,4vw,56px) clamp(24px,4vh,48px)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 72, paddingBottom: 56, borderBottom: `1px solid ${C.light}1a` }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '0.2em', color: C.blue, marginBottom: 16,
          }}>FROM CLUBBERS FOR CLUBBERS</div>
          <h2 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem,8vw,7rem)',
            fontWeight: 700, lineHeight: 0.83, letterSpacing: '-0.05em', color: C.light,
          }}>Groove is<br />the key<span style={{ color: C.blue }}>.</span></h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 40, marginBottom: 48,
        }}>
          <div>
            <img src="/assets/hertz-logo-header.png" alt="HERTZ" style={{ height: 30, opacity: 0.9, marginBottom: 16 }} />
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.light + '66', lineHeight: 1.8 }}>
              hertz.club<br />info@hertz.cc<br />Bologna · IT
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: C.light + '55', marginBottom: 16 }}>// NAVIGATE</h4>
            {[['Events','/events.html'],['Manifesto','/manifesto.html'],['Artists','/artists.html'],['Music','/music.html'],['Merch','/merch.html'],['Media','/media.html']].map(([l,h]) => (
              <a key={l} href={h} style={{ display: 'block', color: C.light + '99', textDecoration: 'none', fontSize: 14, padding: '7px 0', fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif", fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.blue}
              onMouseLeave={e => e.currentTarget.style.color = C.light + '99'}>{l} →</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: C.light + '55', marginBottom: 16 }}>// FREQUENCIES</h4>
            {[['Instagram','https://instagram.com/hertz.cc'],['Spotify','#'],['SoundCloud','#'],['Mixcloud','#']].map(([l,h]) => (
              <a key={l} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel={h.startsWith('http') ? 'noopener noreferrer' : undefined} style={{ display: 'block', color: C.light + '99', textDecoration: 'none', fontSize: 14, padding: '7px 0', fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif", fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.blue}
              onMouseLeave={e => e.currentTarget.style.color = C.light + '99'}>{l} →</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: C.light + '55', marginBottom: 16 }}>// SAFE SPACE</h4>
            <p style={{ fontSize: 12, color: C.light + '66', lineHeight: 1.7, textWrap: 'pretty' }}>
              No harassment. No hate. No discrimination. Respect boundaries — yours and others'. The dancefloor is for everyone.
            </p>
          </div>
        </div>
        <div style={{
          paddingTop: 24, borderTop: `1px solid ${C.light}1a`,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.light + '40', letterSpacing: '0.1em',
        }}>
          <span>© 2026 HERTZ — FROM CLUBBERS TO CLUBBERS</span>
          <span>HZ.CLUB / V8</span>
        </div>
      </div>
    </footer>
  );
}
window.Footer8 = Footer8;
