/* ============================================
   Hertz v8 — Page sections · ICONIC RESKIN
   Same data + content (window.UPCOMING_EVENTS / PAST_EVENTS /
   RESIDENTS_DATA), new design language: room(dark/CRT) ↔
   page(light/riso), brutalist index headers, ticket passes,
   ID-pass residents, waveform dividers. Hero 3D + Nav untouched.
   ============================================ */

/* ── shared builders ───────────────────────── */
function hzWavePath(W, H, comps) {
  var n = Math.max(60, Math.round(W / 3.5)), p = [];
  for (var i = 0; i <= n; i++) {
    var x = i / n * W, y = H / 2;
    // gentle taper at the two ends ONLY — keeps a continuous, uniform signal
    // (no full-width amplitude pulsing, so it reads as a waveform, not an ECG).
    var edge = Math.min(x, W - x), env = Math.min(1, edge / (W * 0.05));
    for (var c = 0; c < comps.length; c++) { y += comps[c].a * env * Math.sin(2 * Math.PI * comps[c].k * x / W + comps[c].p); }
    p.push((i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1));
  }
  return p.join(' ');
}
function hzBuildWave(track) {
  if (!track) return;
  var W = 1440, H = 44,
    d1 = hzWavePath(W, H, [{ a: H * .15, k: 6, p: 0 }, { a: H * .10, k: 11, p: 1.1 }, { a: H * .07, k: 17, p: .4 }, { a: H * .045, k: 24, p: 2.0 }]),
    d2 = hzWavePath(W, H, [{ a: H * .12, k: 5, p: 2 }, { a: H * .075, k: 9, p: .2 }, { a: H * .05, k: 15, p: 1.5 }]),
    svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" fill="none">'
      + '<path d="' + d2 + '" stroke="rgba(20,72,137,.4)" stroke-width="1"/>'
      + '<path d="' + d1 + '" stroke="rgba(28,92,173,.7)" stroke-width="1.6"/></svg>';
  track.innerHTML = svg + svg;
}
function hzBuildBars(el, n) {
  if (!el) return; n = n || 22; var h = '';
  for (var i = 0; i < n; i++) { var w = 1 + Math.round(Math.random() * 3), ht = (58 + Math.random() * 42).toFixed(0); h += '<i style="width:' + w + 'px;height:' + ht + '%"></i>'; }
  el.innerHTML = h;
}

function Reg8() {
  return (
    <span className="reg" aria-hidden="true"><b className="a" /><b className="b2" /><b className="c" /><b className="d" /></span>
  );
}
function HzWave8() {
  const r = React.useRef(null);
  React.useEffect(() => { hzBuildWave(r.current); }, []);
  return <div className="hz-wave"><div className="hz-wave-track" ref={r} /></div>;
}
function HzBars8({ n }) {
  const r = React.useRef(null);
  React.useEffect(() => { hzBuildBars(r.current, n); }, []);
  return <div className="hz-bar" ref={r} />;
}
function IxHead8({ num, kick, title, meta }) {
  const R = window.R8;
  return (
    <R className="hz-ix">
      <h2 className="hz-num" dangerouslySetInnerHTML={{ __html: num }} />
      <div>
        <div className="hz-kick"><span className="ln" />{kick}</div>
        <h3 className="hz-h2" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {meta ? <div className="hz-meta" dangerouslySetInnerHTML={{ __html: meta }} /> : null}
    </R>
  );
}

/* ═══════════════════════════════════════════
   01 · EVENTS — poster rails (page / riso)
   ═══════════════════════════════════════════ */
/* stable per-event id — must match the ids used on events.html so the
   home and the events page write to the same Hertz list. */
function hzEventId(c) {
  if (!c) return 'general';
  var t = (c.title || '').toLowerCase().replace(/×/g, 'x').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  var d = (c.date || '').replace(/\./g, '');
  return d ? (t + '-' + d) : t;
}
window.hzEventId = hzEventId;

function PosterCard8({ card, past }) {
  const cls = 'hz-poster' + (card.comingSoon ? ' coming' : '') + (past ? ' past' : '');
  const dcol = past ? { color: 'var(--gray)' } : null;
  const canRegister = !past && !card.comingSoon;
  const inner = (
    <React.Fragment>
      <div className="img">
        <span className="reg" style={{ color: '#fff' }}><b className="a" /><b className="d" /></span>
        {card.comingSoon
          ? <div className="soon"><b>COMING</b><strong>SOON<span className="blue">.</span></strong></div>
          : <img src={card.poster} alt={card.title} loading="lazy" />}
        <div className="badge">{card.type || 'Event'}</div>
        <div className="n">N°{card.n}</div>
      </div>
      <div className="foot">
        <div className="d" style={dcol}>{past ? '// past' : '// upcoming'} · {card.date}</div>
        <div className="ti">{card.title}</div>
        <div className="v">{card.comingSoon ? card.city : (card.venue + ' · ' + card.city)}</div>
        {canRegister && (
          <button className="reg-cta"
            data-register
            data-event-id={hzEventId(card)}
            data-event-title={card.title}
            data-event-date={card.date}
            data-event-venue={card.venue}
            data-event-city={card.city}
          >Join the Hertz list <span className="ar">→</span></button>
        )}
      </div>
    </React.Fragment>
  );
  return canRegister
    ? <div className={cls}>{inner}</div>
    : <a className={cls} href={card.ctaLink || 'events.html'}>{inner}</a>;
}
function EventsHorizontal8() {
  const R = window.R8;
  const UP = window.UPCOMING_EVENTS || [];
  const PAST = window.PAST_EVENTS || [];
  return (
    <section id="events" className="hz-sec hz-page riso">
      <Reg8 />
      <div className="hz-wrap hz-wide">
        <IxHead8 num={'0<span class="sl">1</span>'} kick="// 01. EVENTS"
          title={'<span class="w2">What\'s</span> <span class="w9 it">next</span><span class="blue">.</span>'} />

        <R><div className="hz-railtag"><span className="hz-dot" />UPCOMING</div></R>
        <R><div className="hz-rail">{UP.map((e, i) => <PosterCard8 key={i} card={e} />)}</div></R>

        <R><div className="hz-railtag" style={{ marginTop: 48, color: 'var(--gray)' }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gray)', display: 'inline-block' }} />THE ARCHIVE</div></R>
        <R><div className="hz-rail">{PAST.map((e, i) => <PosterCard8 key={i} card={e} past />)}</div></R>

        <div className="hz-railhint"><span>←</span><span>SWIPE TO EXPLORE</span><span>→</span></div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   02 · MANIFESTO — live transmission (room / CRT)
   ═══════════════════════════════════════════ */
function Manifesto8() {
  const R = window.R8;
  return (
    <section id="manifesto" className="hz-sec hz-room crt flick">
      <div className="hz-scanband" />
      <Reg8 />
      <div className="hz-wrap">
        <IxHead8 num={'0<span class="sl">2</span>'} kick="// 02. MANIFESTO"
          title={'<span class="w2 it">Live</span> <span class="w9">transmission</span><span class="blue">.</span>'} />

        <R className="hz-trans">
          <div className="hz-credo">
            <span className="hz-cghost">BO</span>
            <h2 className="hz-ch">
              <span className="w2">From</span> <span className="w9 it blue">clubbers</span><span className="w2">,</span><br />
              <span className="w2">for</span> <span className="w7 it blue">clubbers</span><span className="blue">.</span>
            </h2>
            <div className="hz-cbody">
              <p className="chap">Chapter 01. Origin</p>
              <p className="lead">The Hertz collective was born in Bologna in 2023, out of one simple conviction: the night was turning into something to watch, and less and less something to live — rooms built for the camera, with the music stuck somewhere in the background.</p>
              <p>So we put the attention back on what actually matters: the selection, the dancefloor, and the energy shared between clubbers. A floor where the record does the talking, where a good one can <span className="hl">roll for nine minutes</span> before anyone checks the time, and the only reason to leave the house is one — to let the sound take over.</p>
              <p className="chap" style={{ marginTop: 28 }}>Chapter 02. The room</p>
              <p className="big">A room. A system. A crowd that came to listen. The rest is just volume<span className="hz-cur" /></p>
            </div>
            <div className="hz-statgrid">
              <div><div className="k">// based in</div><div className="vv">Bologna, IT</div></div>
              <div><div className="k">// sound</div><div className="vv">Minimal &amp; deep-tech</div></div>
              <div><div className="k">// active since</div><div className="vv">2023</div></div>
              <div><div className="k">// homes</div><div className="vv">Kindergarten · Buongiorno Classic</div></div>
            </div>
            <HzWave8 />
          </div>
        </R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   VISUAL IDENTITY — brand graphics (page / riso)
   ═══════════════════════════════════════════ */
function BrandIdentity8() {
  const R = window.R8;
  const GRAPHICS = [
    { img: 'assets/brand-1.jpg', cap: 'Made in (BO)' },
    { img: 'assets/brand-4.jpg', cap: 'Positive energy · Quality sound' },
    { img: 'assets/brand-2.jpg', cap: 'Clubbing Collective' },
    { img: 'assets/brand-3.jpg', cap: 'We live in frequency' },
  ];
  return (
    <section className="hz-sec hz-page riso">
      <Reg8 />
      <div className="hz-wrap hz-wide">
        <IxHead8 num="+" kick="// VISUAL IDENTITY"
          title={'<span class="w2">Clubbing</span> <span class="w9 it">Collective</span><span class="blue">.</span>'} />
        <R><div className="hz-rail">
          {GRAPHICS.map((g, i) => (
            <figure key={i} className="hz-gfx">
              <img src={g.img} alt={'Hertz brand identity, ' + g.cap} loading="lazy" />
              <figcaption>{String(i + 1).padStart(2, '0')}, {g.cap}</figcaption>
            </figure>
          ))}
        </div></R>
        <div className="hz-railhint"><span>←</span><span>SWIPE TO EXPLORE</span><span>→</span></div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   03 · THE FAMILY — resident ID passes (room / CRT)
   ═══════════════════════════════════════════ */
function FamilySection8() {
  const R = window.R8;
  const RES = window.RESIDENTS_DATA || [];
  return (
    <section id="family" className="hz-sec hz-room crt flick">
      <div className="hz-scanband" />
      <Reg8 />
      <div className="hz-wrap">
        <IxHead8 num={'0<span class="sl">3</span>'} kick="// 03. THE RESIDENTS"
          title={'<span class="w2">On the same</span> <span class="w9 it">frequency</span><span class="blue">.</span>'} />
        <R className="hz-res-grid">
          {RES.map((r) => (
            <a key={r.slug} className="hz-res" href={'artist-' + r.slug + '.html'}>
              <div className="top"><span><b>{r.n}</b> · RESIDENT</span></div>
              <div className="ph"><img src={r.img} alt={r.name} loading="lazy" /><span className="freq">{r.role.split('·')[0].trim()}</span></div>
              <div className="nm">{r.name}</div>
              <div className="role">{r.role}</div>
              <div className="go"><span>View profile</span><span>→</span></div>
            </a>
          ))}
        </R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   04 · THE ARCHIVE — contact sheet (page / riso)
   ═══════════════════════════════════════════ */
function GallerySection8() {
  const R = window.R8;
  const IMGS = [
    { src: 'uploads/24.04_Hertz-95.jpg', r: '4/5' }, { src: 'uploads/24.04_Hertz-17.jpg', r: '3/4' },
    { src: 'uploads/24.04_Hertz-58.jpg', r: '4/5' }, { src: 'uploads/24.04_Hertz-62.jpg', r: '1' },
    { src: 'uploads/24.04_Hertz-73.jpg', r: '3/4' }, { src: 'uploads/24.04_Hertz-86.jpg', r: '4/5' },
    { src: 'uploads/26.12_Hertz-86.jpg', r: '3/4' }, { src: 'uploads/24.04_Hertz-18.jpg', r: '4/5' },
    { src: 'uploads/24.04_Hertz-24.jpg', r: '3/4' }, { src: 'uploads/24.04_Hertz-71.jpg', r: '1' },
    { src: 'uploads/24.04_Hertz-129.jpg', r: '3/4' }, { src: 'uploads/26.12_Hertz-28.jpg', r: '4/5' },
    { src: 'uploads/26.12_Hertz-55.jpg', r: '3/4' },
  ];
  return (
    <section id="sounds" className="hz-sec hz-page riso">
      <Reg8 />
      <div className="hz-wrap hz-wide">
        <IxHead8 num={'0<span class="sl">4</span>'} kick="// 04. THE ARCHIVE"
          title={'<span class="w2">Nights on</span> <span class="w9 it">record</span><span class="blue">.</span>'} />
        <R><div className="hz-rail">
          {IMGS.map((g, i) => (
            <div key={i} className="hz-shot" style={{ aspectRatio: g.r }}>
              <img src={g.src} alt="Hertz night, archive" loading="lazy" />
            </div>
          ))}
        </div></R>
        <div className="hz-railhint"><span>←</span><span>SWIPE TO EXPLORE</span><span>→</span></div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   05 · MERCH — Drop 01 (room)
   ═══════════════════════════════════════════ */
function MerchTeaser8() {
  const R = window.R8;
  const [email, setEmail] = React.useState('');
  const [joined, setJoined] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!email || email.indexOf('@') < 0 || busy) return;
    setBusy(true);
    try { await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); } catch (_) {}
    setJoined(true); setBusy(false);
  };
  return (
    <section id="merch" className="hz-sec hz-room crt flick">
      <div className="hz-scanband" />
      <Reg8 />
      <div className="hz-wrap">
        <IxHead8 num={'0<span class="sl">5</span>'} kick="// 05. HZ.SUPPLY · COMING SOON"
          title={'<span class="w2">Wear the</span> <span class="w9 it">frequency</span><span class="blue">.</span>'} />
        <R className="hz-merch">
          <div>
            <p className="lede">Gear for the floor, not the feed. Streetwear and accessories made by clubbers, for clubbers — heavyweight cotton, technical fabrics, numbered runs. Designed on the dancefloor, worn until they fade.</p>
            <div className="lead-eyebrow">// THE CAPSULE</div>
            <div className="hz-capsule">
              <div className="row"><span className="ix">01</span><span><span className="nm">Apparel</span><span className="ds">Heavyweight tees & hoodies — hand-screened, studio-grade cotton.</span></span><span className="tg">Soon</span></div>
              <div className="row"><span className="ix">02</span><span><span className="nm">Outerwear</span><span className="ds">Shells & layers for the queue, the smoke area, the after.</span></span><span className="tg">Soon</span></div>
              <div className="row"><span className="ix">03</span><span><span className="nm">Headwear</span><span className="ds">Caps & beanies — low-key, built for all-night.</span></span><span className="tg">Soon</span></div>
              <div className="row"><span className="ix">04</span><span><span className="nm">Accessories</span><span className="ds">Lanyards, totes & stickers — the everyday club kit.</span></span><span className="tg on">Drop 01 ▸</span></div>
            </div>
            {!joined ? (
              <form className="hz-form" onSubmit={submit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.cc" aria-label="Email" />
                <button type="submit">{busy ? '...' : 'Notify me →'}</button>
              </form>
            ) : (
              <div className="hz-joined">● ON THE LIST, see you on the dancefloor.</div>
            )}
          </div>
          <div className="hz-drop">
            <div className="lab"><span>HZ.SUPPLY / DROP 01 · ACCESSORIES</span><span className="lim">LIMITED ↗</span></div>
            <div className="hz-dropcard">
              <div className="ed">001/200</div>
              <div className="pic"><img src="assets/merch-lanyard-drop01.png" alt="Hertz lanyard, Drop 01" /></div>
              <div className="specs">
                <div><div className="k">ITEM</div><div className="v">LANYARD</div></div>
                <div><div className="k">MATERIAL</div><div className="v">WOVEN NYLON</div></div>
                <div><div className="k">STATUS</div><div className="v blue">COMING SOON</div></div>
              </div>
            </div>
            <p className="hz-droptag">The first piece — a woven lanyard built to be worn, not displayed. Apparel follows.</p>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   COLLABORIAMO CON — ticket passes (page / riso)
   ═══════════════════════════════════════════ */
function CollabSection8() {
  const R = window.R8;
  const TICKETS = [
    { tilt: 'tilt-l', stub: 'ADMIT ONE · N°023', ser: 'SER. K—0001', logo: 'assets/collab-kindergarten.png',
      name: 'Kindergarten', stamp: 'Resident', data: [['Venue', 'Kindergarten'], ['City', 'Bologna'], ['Coord', '44.4°N 11.3°E'], ['Since', '2023']] },
    { tilt: 'tilt-r', stub: 'ADMIT ONE · N°030', ser: 'SER. B—0002', logo: 'assets/collab-buongiorno-classic.png',
      name: 'Buongiorno Classic', stamp: 'Collab', data: [['Venue', 'Buongiorno Classic'], ['City', 'Rimini'], ['Coord', '44.0°N 12.5°E'], ['Since', '2025']] },
  ];
  return (
    <section id="partners" className="hz-sec hz-page riso">
      <Reg8 />
      <div className="hz-wrap">
        <IxHead8 num="+" kick="// COLLABORIAMO CON"
          title={'<span class="w2">Two rooms,</span> <span class="w9 it">one frequency</span><span class="blue">.</span>'} />
        <R><div className="hz-ticketgrid">
          {TICKETS.map((t) => (
            <figure key={t.name} className={'hz-ticket ' + t.tilt}>
              <div className="stub"><span>{t.stub}</span></div>
              <div className="perf" />
              <div className="body">
                <div className="r1"><span>HERTZ PASS</span><span>{t.ser}</span></div>
                <div className="win"><div className="rings" /><div className="lines" /><img src={t.logo} alt={t.name} /></div>
                <div className="data">
                  {t.data.map(([k, v]) => <div key={k}><span className="k">{k}</span><span className="v">{v}</span></div>)}
                </div>
                <div className="tfoot"><div className="hz-stamp">{t.stamp}</div></div>
                <div className="name"><span className="tk" />{t.name}</div>
              </div>
            </figure>
          ))}
        </div></R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER — coda + footer
   ═══════════════════════════════════════════ */
function Footer8() {
  const NAV = [['Events', 'events.html'], ['Manifesto', 'manifesto.html'], ['Artists', 'artists.html'], ['Music', '#'], ['Merch', 'merch.html'], ['Media', 'media.html'], ['Archive', 'archive.html']];
  const FREQ = [['Instagram', 'https://instagram.com/hertz.cc'], ['Spotify', '#'], ['SoundCloud', '#'], ['Mixcloud', '#']];
  return (
    <React.Fragment>
      <section className="hz-coda">
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div className="k">CLUBBING COLLECTIVE</div>
          <h2><span className="w2">Keep the</span><br /><span className="w9 it">groove</span><span className="blue">.</span></h2>
        </div>
      </section>
      <footer className="hz-foot">
        <div className="cols">
          <div>
            <img src="assets/hertz-logo-header.png" alt="Hertz" />
            <p className="blurb">hertz.cc<br />hertzbologna@gmail.com<br />Bologna · IT</p>
          </div>
          <div>
            <h4>// NAVIGATE</h4>
            {NAV.map(([l, h]) => <a key={l} className="fl" href={h}>{l} →</a>)}
          </div>
          <div>
            <h4>// FREQUENCIES</h4>
            {FREQ.map(([l, h]) => <a key={l} className="fl" href={h} target={h.startsWith('http') ? '_blank' : undefined} rel={h.startsWith('http') ? 'noopener noreferrer' : undefined}>{l} →</a>)}
          </div>
          <div>
            <h4>// SAFE SPACE</h4>
            <p className="safe">No harassment, no hate, no discrimination. Respect boundaries, yours and others'. The dancefloor is for everyone.</p>
          </div>
        </div>
        <div className="legal"><span>© 2026 Hertz, from clubbers to clubbers</span><span>HZ.CC / V8 · WE LIVE IN FREQUENCY</span></div>
      </footer>
    </React.Fragment>
  );
}

/* Export to window so the main app can compose them */
Object.assign(window, {
  EventsHorizontal8, PosterCard8, Manifesto8, BrandIdentity8, FamilySection8,
  CollabSection8, GallerySection8, MerchTeaser8, Footer8,
});
