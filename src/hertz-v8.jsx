/* ============================================
   Hertz v8, Main App
   - 3D logo hero (no enter screen, no cursor trail)
   - Copy: "We are real clubbers." / "from clubbers to clubbers"
   ============================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ─── Palette ─────────────────────────────── */
const Cv8 = {
  dark: '#08080d',
  darkSoft: '#15151d',
  light: '#f5f5f3',
  lightSoft: '#e8e8e3',
  gray: '#9a9a9f',
  cyan: '#00d4ff',
  yellow: '#f5f00d',
  blue: '#144889', // RAL 5010 — enzianblau (gentian blue)
};
window.Cv8 = Cv8;

/* ─── Tweak defaults, single source of truth ─ */
const V8_DEFAULTS = /*EDITMODE-BEGIN*/{
  "logoTexture": "chrome",
  "speed": 1.0,
  "bloom": 1.0,
  "accent": "blue",
  "primary": "white"
}/*EDITMODE-END*/;

const ACCENT_HEX = {
  cyan: '#00d4ff', yellow: '#f5f00d',
  blue: '#144889', white: '#f5f5f3',
};

/* ─── Hooks (shared) ──────────────────────── */
function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
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

function useCountdown(target) {
  const [r, setR] = useState({d:0,h:0,m:0,s:0});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) return {d:0,h:0,m:0,s:0};
      return {
        d: Math.floor(diff/86400000),
        h: Math.floor((diff%86400000)/3600000),
        m: Math.floor((diff%3600000)/60000),
        s: Math.floor((diff%60000)/1000),
      };
    };
    setR(calc());
    const id = setInterval(() => setR(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return r;
}
window.useCountdown = useCountdown;

function R8({ children, delay = 0, y = 60, style = {}, className = '' }) {
  const [ref, vis] = useInView(0.08);
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

/* ─── Events — single source of truth + automatic date split ───
   Add every event here ONCE, with an `iso` date (timed events) or, for
   coming-soon / TBA entries, an `iso` set to midnight of the expected day.
   The site then derives — automatically, from the current date — which
   events are UPCOMING and which have moved to the PAST archive, and which
   one is the hero's NEXT event. No more manually moving events between lists. */
const EVENT_POOL = [
  // ── scheduled / announced ──────────────────────────────────────────
  { title: 'Hertz × Atrium', type: 'Guest', date: '28.06.26', day: 'SUN 28.06', time: 'H18 → late', venue: "Noah's Dream", city: 'Ortona', iso: '2026-06-28T18:00:00', lineup: ["Danilo D'Arrezzo", 'Federico Apadula', 'Adime'], poster: 'assets/poster-v3-28giu-atrium.jpg', n: '026', ctaLabel: 'Info', ctaLink: '#' },
  { title: 'Hertz × Buongiorno Classic', type: 'Collaboration', date: '28.06.26', day: 'SUN 28.06', time: '17:00 → 00:00', venue: 'Buongiorno Classic', city: 'Rimini', iso: '2026-06-28T17:00:00', lineup: ['Tommaso Mancò', 'Alberto B'], poster: 'assets/poster-v3-28giu-buongiorno.jpg', n: '027', ctaLabel: 'Info', ctaLink: '#' },
  { title: 'Hertz Downtown / Il Pallone', type: 'Downtown Gig', date: '04.07.26', day: 'SAT 04.07', time: '19:30 → 23:30', venue: 'Il Pallone', city: 'Bologna', iso: '2026-07-04T19:30:00', lineup: ['Federico Apadula', 'Leonardo Giusti', 'SeaRock'], poster: 'assets/poster-v3-04lug-pallone.jpg', n: '028', ctaLabel: 'Info', ctaLink: '#' },
  { title: 'Hertz / Barracuda Club',     type: 'Collaboration', date: '25.07', day: 'SAT 25.07', city: 'Ferrara', iso: '2026-07-25T00:00:00', n: '029', comingSoon: true },
  { title: 'Hertz × Buongiorno Classic', type: 'Collaboration', date: '26.07.26', day: 'SUN 26.07', time: '05:00 → 00:00', venue: 'Buongiorno Classic', city: 'Rimini', iso: '2026-07-26T05:00:00', lineup: ['Antonio Pica', 'Da Vid', 'Jay De Lys', 'Joey Daniel', 'Hertz'], poster: 'assets/poster-v3-26lug-buongiorno.jpg', n: '030', ctaLabel: 'Info', ctaLink: '#' },
  { title: 'Hertz × Buongiorno Classic', type: 'Collaboration', date: '14.08', day: 'FRI 14.08', city: 'Rimini',  iso: '2026-08-14T00:00:00', n: '031', comingSoon: true },
  { title: 'Hertz / Barracuda Club',     type: 'Collaboration', date: '15.08', day: 'SAT 15.08', city: 'Ferrara', iso: '2026-08-15T00:00:00', n: '032', comingSoon: true },
  // ── archive ────────────────────────────────────────────────────────
  {
    title: 'Take Notes × Buongiorno Classic',
    type: 'Guest / Showcase',
    date: '31.05.26', day: 'SUN 31.05', time: '16:00 → 06:00',
    venue: 'Buongiorno Classic', city: 'Rimini',
    lineup: ['Mahony', 'Wheats', 'AG Swifty', 'Brad Brunner', 'Kov', 'Hertz', 'Jaco Etch × Chory', 'Lenny Krazyz × Lucangelini', 'Matteo Gatti', 'Tynx'],
    poster: 'assets/poster-v3-31mag-takenotes.jpg',
    n: '025',
  },
  {
    title: 'Hertz at Cassero',
    type: 'Collab',
    date: '29.05.26', day: 'FRI 29.05', time: '23:30 → LATE',
    venue: 'Cassero', city: 'Bologna',
    lineup: ['Federico Apadula', 'SeaRock', 'Tommaso Mancò', 'Alberto B'],
    poster: 'assets/poster-v3-29mag-cassero.jpg',
    n: '024',
  },
  {
    title: 'Hertz at Kindergarten',
    type: 'Hertz Event',
    date: '24.04.26', day: 'FRI 24.04', time: '23:59 → late',
    venue: 'Kindergarten', city: 'Bologna',
    lineup: ['Federico Apadula', 'Luca Paolella', 'Alberto B', 'Tommaso Mancò', 'Matteo Fava', 'Leonardo Giusti'],
    poster: 'assets/poster-v3-24apr-kindergarten.jpg',
    n: '023',
  },
  {
    title: 'Hertz at Kindergarten',
    type: 'Hertz Event',
    date: '27.02.26', day: 'FRI 27.02', time: '23:59 → late',
    venue: 'Kindergarten', city: 'Bologna',
    lineup: ['Federico Apadula', 'Groover', 'Adime', 'Tommaso Mancò', 'Alberto B', 'TommyTerzi'],
    poster: 'assets/poster-v3-27feb-kindergarten.jpg',
    n: '022',
  },
  {
    title: 'Hertz at Kindergarten',
    type: 'Hertz Event',
    date: '26.12.25', day: 'FRI 26.12', time: '23:59 → late',
    venue: 'Kindergarten', city: 'Bologna',
    lineup: ['Federico Apadula', 'Tommaso Mancò', 'Alberto B', 'Matteo Fava', 'Leonardo Giusti'],
    poster: 'assets/poster-v3-26dic-kindergarten.jpg',
    n: '021',
  },
  {
    title: 'Buongiorno Classic Goes To Hertz',
    type: 'Collab',
    date: '22.11.25', day: 'SAT 22.11', time: '23:59 → late',
    venue: 'Numa Club', city: 'Bologna',
    lineup: ['Tomi & Kesh', 'Matteo Gatti × Ocular', 'Federico Apadula', 'Tommaso Mancò × Alberto B'],
    poster: 'assets/poster-v3-22nov-numa.jpg',
    n: '020',
  },
  {
    title: 'Hertz at Kindergarten',
    type: 'Hertz Event',
    date: '24.10.25', day: 'FRI 24.10', time: '23:59 → late',
    venue: 'Kindergarten', city: 'Bologna',
    lineup: ['Federico Apadula', 'Alberto B', 'Nesh b2b Dante Bi', 'Matteo Fava', 'Gemi'],
    poster: 'assets/poster-v3-24ott-kindergarten.jpg',
    n: '019',
  },
  {
    title: 'Classic Airlines',
    type: 'Collab',
    date: '21.09.25', day: 'SUN 21.09', time: '07:00 → 22:00',
    venue: 'Classic Airlines', city: 'Rimini',
    lineup: ['Fletch Modular', 'Esmito × Andrea Mili', 'Hertz', 'K.A.M.A.', "Kiss 'N' Fly", 'Phil-O'],
    poster: 'assets/poster-v3-21set-classicairlines.jpg',
    n: '018',
  },
];

/* Automatic split — an event is "past" once its calendar day is over, so it
   stays in UPCOMING (and can remain the hero's NEXT event) throughout its own
   day, then moves to the archive the next morning. Recomputed on every load. */
function hzEventEndMs(e) {
  if (!e) return null;
  var y, mo, d;
  if (e.iso) {
    var dt = new Date(e.iso);
    if (isNaN(dt)) return null;
    y = dt.getFullYear(); mo = dt.getMonth(); d = dt.getDate();
  } else if (e.date) {
    var p = e.date.split('.');          // dd.mm.yy  (dd.mm without a year = TBA → kept upcoming)
    if (p.length < 3) return null;
    d = parseInt(p[0], 10); mo = parseInt(p[1], 10) - 1; y = 2000 + parseInt(p[2], 10);
  } else return null;
  return new Date(y, mo, d, 23, 59, 59, 999).getTime();
}
const HZ_NOW = Date.now();
const _events = EVENT_POOL.map(function (e) { return { e: e, ms: hzEventEndMs(e) }; });
const UPCOMING_EVENTS = _events
  .filter(function (x) { return x.ms == null || x.ms >= HZ_NOW; })
  .sort(function (a, b) { return (a.ms == null ? Infinity : a.ms) - (b.ms == null ? Infinity : b.ms); })
  .map(function (x) { return x.e; });
const PAST_EVENTS = _events
  .filter(function (x) { return x.ms != null && x.ms < HZ_NOW; })
  .sort(function (a, b) { return b.ms - a.ms; })
  .map(function (x) { return x.e; });
// Hero's next event: soonest upcoming with a confirmed date/time (skip TBA).
const NEXT_EVENT = UPCOMING_EVENTS.find(function (e) { return e.iso && !e.comingSoon; })
  || UPCOMING_EVENTS[0]
  || PAST_EVENTS[0]
  || { title: 'TBA', day: '', venue: '', city: '', iso: '2099-01-01T00:00:00' };
window.UPCOMING_EVENTS = UPCOMING_EVENTS;
window.PAST_EVENTS = PAST_EVENTS;
window.NEXT_EVENT = NEXT_EVENT;

const RESIDENTS_DATA = [
  { name: 'Federico Apadula', slug: 'federico-apadula', role: 'Founder · Art Director · DJ & Producer', img: 'assets/dj-apadula.jpg', n: '01', freq: '120 Hz' },
  { name: 'Tommaso Mancò',    slug: 'tommaso-manco',    role: 'DJ',                                     img: 'assets/dj-manco.jpg',   n: '02', freq: '128 Hz' },
  { name: 'Alberto B',         slug: 'alberto-b',        role: 'DJ · Producer',                         img: 'assets/dj-alberto.jpg', n: '03', freq: '125 Hz' },
  { name: 'Leonardo Giusti',   slug: 'leonardo-giusti',  role: 'DJ',                                    img: 'assets/dj-giusti.jpg',  n: '04', freq: '126 Hz' },
];
window.RESIDENTS_DATA = RESIDENTS_DATA;

/* ═══════════════════════════════════════════
   3D LOGO STAGE, mounts the voxel/extrusion scene
   from hero3d-scenes.jsx into a fixed bg layer
   ═══════════════════════════════════════════ */
function LogoStage({ tweaks }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const T = window.THREE;
    if (!T || !window.HertzScenes) return;
    const mount = mountRef.current;
    if (!mount) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const isMobile = W < 768;

    const scene = new T.Scene();
    scene.background = new T.Color(0x08080d);
    scene.fog = new T.FogExp2(0x08080d, 0.025);

    const camera = new T.PerspectiveCamera(48, W / H, 0.1, 200);
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 1.1, 0);

    const renderer = new T.WebGLRenderer({ 
      alpha: true, 
      antialias: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setClearColor(0x08080d, 1);
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.5));
    mount.appendChild(renderer.domElement);

    const root = new T.Group();
    scene.add(root);

    /* mount the logo scene from hero3d-scenes.jsx */
    const sceneObj = window.HertzScenes.logo(T, root, 1.0, { texture: tweaks.logoTexture, isMobile });
    const hint = sceneObj.cameraHint || { pos: [0, 0, 7], look: [0, 1.1, 0] };
    const initialZ = isMobile ? hint.pos[2] * 1.8 : hint.pos[2];
    camera.position.set(hint.pos[0], hint.pos[1], initialZ);
    // On mobile: look lower so the logo renders in the upper 1/3 of the screen,
    // leaving the bottom 2/3 clear for the text overlay.
    const camTarget = new T.Vector3(
      hint.look[0],
      isMobile ? hint.look[1] - 1.2 : hint.look[1],
      hint.look[2]
    );
    const camPos = new T.Vector3(hint.pos[0], hint.pos[1], initialZ);
    camera.lookAt(camTarget);

    stateRef.current = { sceneObj };

    /* mouse parallax */
    let mx = 0, my = 0;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      // On mobile, ignore height-only changes (iOS URL bar showing/hiding)
      if (newW === W && isMobile) return;
      W = newW; H = newH;
      const isMobileNow = W < 768;
      camPos.setZ(isMobileNow ? hint.pos[2] * 1.8 : hint.pos[2]);
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* pause rendering when canvas off-screen */
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(mount);

    const startTime = performance.now() / 1000;
    let raf;

    /* fake beat clock, kept for scene shader continuity */
    const BPM = 128;
    const beatPeriod = 60 / BPM;
    let lastBeatIdx = -1, kickEnv = 0, snareEnv = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const now = performance.now() / 1000;
      const t = now - startTime;
      const totalBeats = t / beatPeriod;
      const beatIdx = Math.floor(totalBeats);
      if (beatIdx !== lastBeatIdx) {
        lastBeatIdx = beatIdx;
        kickEnv = 1;
        if (beatIdx % 2 === 1) snareEnv = 1;
      }
      kickEnv = Math.max(0, kickEnv - 0.08);
      snareEnv = Math.max(0, snareEnv - 0.05);
      const beat = { phase: totalBeats - beatIdx, beatIdx,
                     barIdx: Math.floor(beatIdx / 4),
                     kick: kickEnv, snare: snareEnv };

      const p = stateRef.current.params || {};
      const tgtX = camPos.x + mx * 0.5;
      const tgtY = camPos.y - my * 0.35;
      camera.position.x += (tgtX - camera.position.x) * 0.04;
      camera.position.y += (tgtY - camera.position.y) * 0.04;
      camera.position.z += (camPos.z - camera.position.z) * 0.04;
      camera.lookAt(camTarget);

      sceneObj.tick(t, beat, p);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      sceneObj.dispose && sceneObj.dispose();
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [tweaks.logoTexture]); // remount only on texture change (needs new shader logic? actually mode is in uniform — but we keep simple for now)

  /* react to colors/speed without remount */
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    s.params = {
      speed: tweaks.speed,
      bloom: tweaks.bloom,
      accentColor: ACCENT_HEX[tweaks.accent] || ACCENT_HEX.yellow,
      primaryColor: ACCENT_HEX[tweaks.primary] || ACCENT_HEX.cyan,
    };
  }, [tweaks]);

  return (
    <div ref={mountRef} style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: '20%', zIndex: 0,
      pointerEvents: 'none',
    }} />
  );
}
window.LogoStage = LogoStage;

/* ═══════════════════════════════════════════
   NAV, always visible, logo top-left
   ═══════════════════════════════════════════ */
function Nav8() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    const r = () => setIsMobile(window.innerWidth < 850);
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('scroll', h, { passive: true });
    window.addEventListener('resize', r, { passive: true });
    window.addEventListener('keydown', onKey);
    r();
    return () => {
      window.removeEventListener('scroll', h);
      window.removeEventListener('resize', r);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const items = [
    { label: 'Events',    href: 'events.html' },
    { label: 'Manifesto', href: 'manifesto.html' },
    { label: 'Artists',   href: 'artists.html' },
    { label: 'Music',     href: 'music.html' },
    { label: 'Merch',     href: 'merch.html' },
    { label: 'Media',     href: 'media.html' },
    { label: 'Archive',   href: 'archive.html' },
  ];
  const path = (typeof location !== 'undefined') ? location.pathname : '/';
  const filename = path.split('/').pop();
  const isActive = (href) => {
    const target = href.replace('/', '');
    if (filename === target) return true;
    if (href === 'media.html' && path.startsWith('/media/')) return true;
    return false;
  };
  
  return (
    <>
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(20px, 4vw, 56px)', height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: menuOpen ? 'transparent' : Cv8.dark,
      borderBottom: `1px solid ${scrolled && !menuOpen ? Cv8.light + '14' : 'transparent'}`,
      transition: 'all 0.4s cubic-bezier(.22,1,.36,1)',
    }}>
      <a href="index.html" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', zIndex: 101 }}>
        <img src="assets/hertz-logo-header.png" alt="Hertz" style={{ height: 36, opacity: 0.95 }} />
      </a>
      
      {isMobile ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background: 'none', border: 'none', outline: 'none', color: Cv8.light,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
            cursor: 'pointer', zIndex: 101, padding: 8,
            minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      ) : (
        <div style={{
          display: 'flex', gap: 'clamp(14px, 2.2vw, 28px)',
          alignItems: 'center',
        }}>
          {items.map(item => {
            const active = isActive(item.href);
            return (
              <a key={item.label} href={item.href} style={{
                color: active ? Cv8.light : Cv8.light + 'aa',
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'color 0.18s, transform 0.18s',
                display: 'inline-block',
                borderBottom: active ? `1px solid ${Cv8.blue}` : '1px solid transparent',
                paddingBottom: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = Cv8.blue; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = active ? Cv8.light : Cv8.light + 'aa'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >{item.label}</a>
            );
          })}
          <a
            href="bookings.html"
            aria-label="Bookings for the next event"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
              background: 'transparent', color: Cv8.light,
              border: `1px solid ${Cv8.light}33`,
              padding: '10px 18px',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
              textDecoration: 'none', display: 'inline-block',
              outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = Cv8.blue; e.currentTarget.style.color = Cv8.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = Cv8.light + '33'; e.currentTarget.style.color = Cv8.light; }}
          >Bookings ↗</a>
        </div>
      )}
    </nav>
    
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
        gap: 32, opacity: menuOpen ? 1 : 0,
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
            color: Cv8.light, textDecoration: 'none',
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700,
            letterSpacing: '-0.02em',
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s cubic-bezier(.22,1,.36,1) ${i * 0.05}s`,
          }}
          onMouseEnter={e => e.currentTarget.style.color = Cv8.blue}
          onMouseLeave={e => e.currentTarget.style.color = Cv8.light}
        >{item.label}</a>
      ))}
      <a
        href="bookings.html"
        aria-label="Bookings"
        style={{
          marginTop: 24, display: 'inline-block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, fontWeight: 600, letterSpacing: '0.16em',
          background: Cv8.blue, color: Cv8.light,
          border: 'none', padding: '14px 32px',
          textTransform: 'uppercase', textDecoration: 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: `all 0.4s cubic-bezier(.22,1,.36,1) ${items.length * 0.05}s`,
        }}
      >Bookings ↗</a>
    </div>
    </>
  );
}
window.Nav8 = Nav8;

/* ═══════════════════════════════════════════
   HERO 8, full viewport, 3D logo behind copy
   ═══════════════════════════════════════════ */
function Hero8({ countdown, primary, accent, tweaks }) {
  const mono = { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' };
  return (
    <section className="hz-mobile-hero" style={{
      minHeight: '100vh', position: 'relative',
      overflow: 'hidden',
      color: Cv8.light,
    }}>
      <LogoStage tweaks={tweaks} />
      <div className="hz-mobile-hero" style={{
        position: 'relative', zIndex: 2,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 'clamp(96px, 12vh, 130px) clamp(20px, 4vw, 56px) clamp(40px, 6vh, 70px)',
      }}>
      {/* TOP, live transmission strip */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        ...mono, fontSize: 10, color: Cv8.gray,
      }}>
        <div>
          <div style={{ color: primary, marginBottom: 4 }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: primary, marginRight: 8,
              animation: 'scan 1.6s ease-in-out infinite',
            }} />
            LIVE TRANSMISSION
          </div>
          <div>BOLOGNA · 44.4°N 11.3°E</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>{new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase()}</div>
        </div>
      </div>

      {/* WORDMARK — anchored to a FIXED band well below the 3D logo.
         The flexible spacer now lives BELOW it (see further down), so the
         next-event row can grow or shrink without ever pushing the wordmark
         up into the rotating logo. This is the definitive lock — editing the
         bottom content can no longer move this. */}
      <div style={{ textAlign: 'center', maxWidth: 900, margin: 'clamp(200px, 42vh, 480px) auto 0', flex: '0 0 auto' }}>
          <h1 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700, lineHeight: 1.05, margin: 0,
            letterSpacing: '-0.025em', color: Cv8.light,
          }}>
            Clubbing{' '}
            <span style={{ color: primary, fontStyle: 'italic', fontWeight: 500 }}>Collective</span>
            <span style={{ color: accent }}>.</span>
          </h1>
          <p style={{
            ...mono, fontSize: 11, color: Cv8.gray, marginTop: 4,
            textTransform: 'uppercase',
          }}>// from clubbers to clubbers · bologna est. 2023</p>
        </div>

        {/* flexible gap — absorbs ALL variation below the wordmark, so the
           row below never shifts the wordmark. */}
        <div style={{ flex: 1, minHeight: 'clamp(28px, 7vh, 80px)' }} />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: 20,
        }}>
          {/* next event */}
          <div style={{ minWidth: 0, flex: '1 1 200px' }}>
            <div style={{
              ...mono, fontSize: 10, color: Cv8.gray, marginBottom: 10,
            }}>↓ NEXT EVENT</div>
            <div style={{
              fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
              fontSize: 'clamp(18px, 2vw, 28px)', fontWeight: 700,
              color: Cv8.light, letterSpacing: '-0.02em', marginBottom: 6,
            }}>{NEXT_EVENT.title}</div>
            <div style={{ ...mono, fontSize: 11, color: Cv8.gray }}>
              {NEXT_EVENT.day}{NEXT_EVENT.time ? ` · ${NEXT_EVENT.time}` : ''} · <span style={{ color: accent }}>@{NEXT_EVENT.venue}, {NEXT_EVENT.city}</span>
            </div>
            <button
              data-register
              data-event-id={(window.hzEventId ? window.hzEventId(NEXT_EVENT) : 'general')}
              data-event-title={NEXT_EVENT.title}
              data-event-date={NEXT_EVENT.date}
              data-event-venue={NEXT_EVENT.venue}
              data-event-city={NEXT_EVENT.city}
              style={{
                marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff',
                background: Cv8.blue, border: `1px solid ${Cv8.blue}`, padding: '11px 16px',
                cursor: 'pointer', transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1c5cad'; e.currentTarget.style.transform = 'translateX(2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = Cv8.blue; e.currentTarget.style.transform = 'translateX(0)'; }}
            >Join the Hertz list →</button>
          </div>

          {/* countdown */}
          <div style={{
            padding: '12px 18px',
            border: `1px solid ${Cv8.light}1f`,
            background: 'rgba(8,8,13,0.55)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ ...mono, fontSize: 9, color: Cv8.gray, marginBottom: 6, letterSpacing: '0.2em' }}>
              STARTS IN
            </div>
            <div style={{
              display: 'flex', gap: 12, alignItems: 'baseline',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {[
                { v: countdown.d, l: 'd' },
                { v: countdown.h, l: 'h' },
                { v: countdown.m, l: 'm' },
                { v: countdown.s, l: 's' },
              ].map(({ v, l }) => (
                <div key={l} style={{
                  fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                  fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 700, color: primary,
                  letterSpacing: '-0.02em',
                }}>{String(v || 0).padStart(2, '0')}<span style={{
                  fontSize: 10, color: Cv8.gray, marginLeft: 2,
                  ...mono, fontWeight: 400,
                }}>{l}</span></div>
              ))}
            </div>
          </div>
        </div>

      {/* BPM badge centered bottom */}
      <BeatBadge8 accent={accent} />
      </div>
    </section>
  );
}

function BeatBadge8({ accent }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000 / 128);
    return () => clearInterval(id);
  }, []);
  const on = tick % 2 === 0;
  return (
    <div style={{
      position: 'absolute', bottom: 18,
      left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, color: Cv8.gray, letterSpacing: '0.2em',
      pointerEvents: 'none',
    }}>
      <span style={{
        display: 'inline-block', width: 8, height: 8,
        borderRadius: '50%', background: accent,
        opacity: on ? 1 : 0.25,
        transition: 'opacity 0.08s',
      }} />
      <span>128 BPM</span>
    </div>
  );
}
window.Hero8 = Hero8;

/* ═══════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════ */
function HertzV8App() {
  const [tweaks, setTweak] = useTweaks(V8_DEFAULTS);
  const countdown = useCountdown(NEXT_EVENT.iso);

  const primary = ACCENT_HEX[tweaks.primary] || Cv8.cyan;
  const accent  = ACCENT_HEX[tweaks.accent]  || Cv8.yellow;

  return (
    <div style={{ background: Cv8.dark, minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav8 />
        <Hero8 countdown={countdown} primary={primary} accent={accent} tweaks={tweaks} />
        {/* Sections below, defined in hertz-v8-sections.jsx */}
        <window.EventsHorizontal8 />
        <window.Manifesto8 />
        <window.BrandIdentity8 />
        <window.FamilySection8 />
        <window.GallerySection8 />
        <window.MerchTeaser8 />
        <window.CollabSection8 />
        <window.Footer8 />
      </div>

      <TweaksPanel>
        <TweakSection label="Hero 3D logo" />
        <TweakSelect
          label="Texture" value={tweaks.logoTexture}
          options={[
            { value: 'chrome',   label: 'Chrome' },
            { value: 'mercury',  label: 'Mercury (fluid)' },
            { value: 'steel',    label: 'Brushed steel' },
            { value: 'marble',   label: 'Marble' },
            { value: 'concrete', label: 'Concrete' },
            { value: 'glass',    label: 'Glass' },
            { value: 'neon',     label: 'Neon' },
            { value: 'holo',     label: 'Holographic' },
            { value: 'flat',     label: 'Flat white' },
          ]}
          onChange={(v) => setTweak('logoTexture', v)}
        />
        <TweakSlider label="Speed" value={tweaks.speed} min={0.1} max={3} step={0.05}
          onChange={(v) => setTweak('speed', v)} />
        <TweakSlider label="Glow" value={tweaks.bloom} min={0} max={2.5} step={0.05}
          onChange={(v) => setTweak('bloom', v)} />
        <TweakSection label="Color" />
        <TweakRadio label="Accent" value={tweaks.accent}
          options={['cyan','yellow','blue','white']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakRadio label="Primary" value={tweaks.primary}
          options={['cyan','yellow','blue','white']}
          onChange={(v) => setTweak('primary', v)} />
      </TweaksPanel>
    </div>
  );
}
window.HertzV8App = HertzV8App;
