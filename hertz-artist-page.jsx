/* ============================================
   Hertz, Artist detail page template
   Requires: hertz-shared.jsx (Nav8, Footer8, Cv8, R8)
   Usage: <window.ArtistPage artist={ARTIST} events={EVENTS} />
   ============================================ */

function ArtistGallery({ images, name }) {
  const C = window.Cv8;
  const scrollRef = React.useRef(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const updateEdges = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges, { passive: true });
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-gallery-card]');
    const step = card ? card.offsetWidth + 14 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const arrowStyle = (disabled) => ({
    width: 44, height: 44, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', cursor: disabled ? 'default' : 'pointer',
    border: `1px solid ${C.light}${disabled ? '14' : '33'}`,
    color: C.light + (disabled ? '33' : 'aa'),
    fontSize: 18, transition: 'all 0.2s', outline: 'none',
  });

  return (
    <section style={{
      background: C.dark,
      padding: 'clamp(48px, 8vh, 80px) 0 clamp(48px, 8vh, 80px)',
      borderTop: `1px solid ${C.light}0e`,
    }}>
      <style>{`.hz-gallery-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '0 clamp(20px, 4vw, 56px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 16, marginBottom: 28,
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: C.blue }}>// GALLERY</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button aria-label="Previous" onClick={() => scrollBy(-1)} disabled={atStart} style={arrowStyle(atStart)}
            onMouseEnter={e => { if (!atStart) { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.light + (atStart ? '14' : '33'); e.currentTarget.style.color = C.light + (atStart ? '33' : 'aa'); }}
          >←</button>
          <button aria-label="Next" onClick={() => scrollBy(1)} disabled={atEnd} style={arrowStyle(atEnd)}
            onMouseEnter={e => { if (!atEnd) { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.light + (atEnd ? '14' : '33'); e.currentTarget.style.color = C.light + (atEnd ? '33' : 'aa'); }}
          >→</button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="hz-gallery-scroll"
        style={{
          display: 'flex', gap: 14,
          overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          padding: '0 clamp(20px, 4vw, 56px)',
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            data-gallery-card
            style={{
              flex: '0 0 auto',
              width: 'clamp(260px, 34vw, 420px)',
              aspectRatio: '4/5',
              background: C.darkSoft,
              scrollSnapAlign: 'start',
              overflow: 'hidden',
            }}
          >
            <img
              src={src}
              alt={`${name}, live ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

const HZ_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function EventAppearanceRow({ ev, last }) {
  const C = window.Cv8;
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const briq = { fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif" };
  const isPast = ev.status === 'past';
  const [dd, mm] = String(ev.date || '').split('.');
  const wk = String(ev.day || '').split(' ')[0];
  const monthName = HZ_MONTHS[(parseInt(mm, 10) || 1) - 1] || '';
  const accent = isPast ? C.light + '40' : C.blue;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      gap: 'clamp(14px, 2.2vw, 30px)',
      alignItems: 'center',
      padding: 'clamp(14px, 1.8vw, 20px) 0',
      borderBottom: last ? 'none' : `1px solid ${C.light}10`,
      opacity: isPast ? 0.62 : 1,
    }}>
      {/* date cell */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        width: 'clamp(60px, 8vw, 80px)', padding: '9px 0',
        border: `1px solid ${isPast ? C.light + '16' : C.blue}`,
        background: isPast ? 'transparent' : 'rgba(20,72,137,0.10)',
      }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: '0.14em', color: accent, marginBottom: 3 }}>{wk}</div>
        <div style={{ ...briq, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 0.85, letterSpacing: '-0.03em', color: C.light }}>{dd}</div>
        <div style={{ ...mono, fontSize: 9, letterSpacing: '0.14em', color: C.light + '66', marginTop: 3 }}>{monthName}</div>
      </div>

      {/* event */}
      <div style={{ minWidth: 0 }}>
        <h3 style={{ ...briq, fontSize: 'clamp(15px, 1.9vw, 20px)', fontWeight: 700, letterSpacing: '-0.02em', color: C.light, margin: 0, lineHeight: 1.12 }}>{ev.title}</h3>
        <div style={{ ...mono, fontSize: 10, letterSpacing: '0.08em', color: C.gray, marginTop: 6, textTransform: 'uppercase' }}>
          {ev.venue}{ev.city ? ` · ${ev.city}` : ''}{ev.note ? <span style={{ color: accent }}> · {ev.note}</span> : null}
        </div>
      </div>

      {/* status + code */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        {!isPast
          ? <span style={{ ...mono, fontSize: 8, letterSpacing: '0.16em', color: C.light, background: C.blue, padding: '4px 8px', textTransform: 'uppercase' }}>Upcoming</span>
          : <span style={{ ...mono, fontSize: 8, letterSpacing: '0.16em', color: C.light + '44', border: `1px solid ${C.light}16`, padding: '4px 8px', textTransform: 'uppercase' }}>Played</span>}
        <span style={{ ...mono, fontSize: 9, letterSpacing: '0.1em', color: C.light + '2e' }}>HZ.{ev.n}</span>
      </div>
    </div>
  );
}

function ArtistPage({ artist, events = [] }) {
  const C = window.Cv8;
  const R = window.R8;
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const briq = { fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif" };
  const [imgFailed, setImgFailed] = React.useState(false);
  const [playing, setPlaying] = React.useState(null);

  const upcoming = events.filter(e => e.status === 'upcoming');
  const past = events.filter(e => e.status === 'past');

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <window.Nav8 />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '80vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
        padding: 'clamp(100px, 15vh, 140px) clamp(20px, 4vw, 56px) clamp(48px, 8vh, 80px)',
      }}>
        {!imgFailed && (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${artist.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center 20%',
              filter: 'saturate(0.6) brightness(0.65) contrast(1.1)',
            }} />
            <img src={artist.img} alt="" onError={() => setImgFailed(true)} style={{ display: 'none' }} />
          </>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(8,8,13,0.98) 0%, rgba(8,8,13,0.5) 45%, rgba(8,8,13,0.15) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', flexWrap: 'wrap', gap: 24,
          }}>
            <div>
              <div style={{ ...mono, fontSize: 11, letterSpacing: '0.2em', color: C.blue, marginBottom: 12 }}>
                HZ, {artist.n} / RESIDENT
              </div>
              <h1 style={{
                ...briq,
                fontSize: 'clamp(2.2rem, 9vw, 9rem)',
                fontWeight: 700, lineHeight: 0.83, letterSpacing: '-0.04em',
                color: C.light,
              }}>{artist.name}<span style={{ color: C.blue }}>.</span></h1>
              <p style={{
                ...mono, fontSize: 12, letterSpacing: '0.15em',
                color: C.light + '66', textTransform: 'uppercase', marginTop: 18,
              }}>{artist.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIO + SOUND ── */}
      <section style={{
        padding: 'clamp(56px, 9vh, 96px) clamp(20px, 4vw, 56px)',
        borderTop: `1px solid ${C.light}0e`,
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
        }}>
          <R>
            <div style={{ ...mono, fontSize: 10, letterSpacing: '0.2em', color: C.blue, marginBottom: 20 }}>// BIOGRAPHY</div>
            {artist.bio.split('\n\n').map((para, i, arr) => (
              <p key={i} style={{
                fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.85,
                color: C.light + 'bb', textWrap: 'pretty',
                marginBottom: i < arr.length - 1 ? '1.3em' : 0,
              }}>{para}</p>
            ))}
          </R>

          <R delay={0.12}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: '0.2em', color: C.blue, marginBottom: 20 }}>// SOUND PROFILE</div>
            {[['Style', artist.sets], ['Based in', artist.origin], ['With Hertz since', artist.since]].map(([k, v]) => (
              <div key={k} style={{ borderBottom: `1px solid ${C.light}0e`, paddingBottom: 16, marginBottom: 16 }}>
                <div style={{ ...mono, fontSize: 10, color: C.light + '33', letterSpacing: '0.16em', marginBottom: 4, textTransform: 'uppercase' }}>{k}</div>
                <div style={{ ...briq, fontSize: 'clamp(17px, 1.9vw, 22px)', fontWeight: 700, color: C.light, letterSpacing: '-0.02em' }}>{v}</div>
              </div>
            ))}
            {artist.social && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                {[
                  artist.social.instagram && ['Instagram', artist.social.instagram],
                  artist.social.booking   && ['Booking',   `mailto:${artist.social.booking}`],
                ].filter(Boolean).map(([label, href]) => (
                  <a key={label} href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                    style={{
                      ...mono, fontSize: 10, letterSpacing: '0.14em',
                      color: C.light + '77', textDecoration: 'none',
                      border: `1px solid ${C.light}1a`, padding: '12px 14px',
                      textTransform: 'uppercase', transition: 'all 0.2s',
                      minHeight: 44, display: 'inline-flex', alignItems: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.light + '77'; e.currentTarget.style.borderColor = C.light + '1a'; }}
                  >{label} ↗</a>
                ))}
              </div>
            )}
          </R>
        </div>
      </section>

      {/* ── GALLERY ── */}
      {artist.gallery && artist.gallery.length > 0 && (
        <ArtistGallery images={artist.gallery} name={artist.name} />
      )}

      {/* ── MUSIC ── */}
      {(artist.mixes?.length > 0 || artist.social?.spotify || artist.social?.soundcloud) && (
        <section style={{
          background: C.darkSoft,
          padding: 'clamp(48px, 8vh, 80px) clamp(20px, 4vw, 56px)',
          borderTop: `1px solid ${C.light}0e`,
        }}>
          <R>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: '0.2em', color: C.blue, marginBottom: 32 }}>// MUSIC</div>
              {artist.mixes && artist.mixes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 36, border: `1px solid ${C.light}10` }} role="list">
                  {artist.mixes.map((mix, i) => {
                    const open = playing === i;
                    const featured = mix.tag && String(mix.tag).toLowerCase() === 'featured';
                    const baseBg = featured ? 'rgba(20,72,137,0.07)' : 'transparent';
                    return (
                      <div key={i} role="listitem" style={{ borderTop: i ? `1px solid ${C.light}10` : 'none' }}>
                        <div
                          onClick={() => setPlaying(open ? null : i)}
                          aria-label={`${open ? 'Close' : 'Play'} ${mix.title} by ${artist.name}`}
                          tabIndex={0}
                          onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setPlaying(open ? null : i); } }}
                          style={{
                            display: 'grid', gridTemplateColumns: 'clamp(60px,7vw,76px) 1fr auto', gap: 'clamp(14px,1.6vw,20px)', alignItems: 'center',
                            padding: 'clamp(12px,1.5vw,16px) clamp(12px,1.5vw,18px)',
                            cursor: 'pointer', transition: 'background 0.2s', outline: 'none',
                            background: baseBg, borderLeft: `2px solid ${featured ? C.blue : 'transparent'}`,
                          }}
                          onMouseEnter={ev => ev.currentTarget.style.background = featured ? 'rgba(20,72,137,0.13)' : C.dark}
                          onMouseLeave={ev => ev.currentTarget.style.background = baseBg}
                          onFocus={ev => ev.currentTarget.style.background = featured ? 'rgba(20,72,137,0.13)' : C.dark}
                          onBlur={ev => ev.currentTarget.style.background = baseBg}
                        >
                          <div style={{ position: 'relative', width: 'clamp(60px,7vw,76px)', aspectRatio: '1', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={mix.img || artist.img} alt={artist.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.5) brightness(0.65)' }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: open ? 'rgba(20,72,137,0.5)' : 'rgba(0,0,0,0.35)', transition: 'background 0.2s' }}>
                              <span aria-hidden="true" style={{ fontSize: 16, color: C.light }}>{open ? '⏸' : '▶'}</span>
                            </div>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ ...mono, fontSize: 9, color: C.light + '55', letterSpacing: '0.16em', marginBottom: 6, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {artist.name}
                              {featured && <span style={{ background: C.blue, color: C.light, padding: '2px 6px', fontSize: 8, letterSpacing: '0.14em' }}>FEATURED</span>}
                            </div>
                            <h3 style={{ ...briq, fontSize: 'clamp(1rem,1.7vw,1.25rem)', fontWeight: 700, letterSpacing: '-0.02em', color: C.light, margin: 0, lineHeight: 1.15 }}>{mix.title}</h3>
                          </div>
                          <div style={{ ...mono, fontSize: 9, letterSpacing: '0.16em', color: open ? C.blue : C.light + '55', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            {open ? '⏸ Playing' : '▶ Play'}
                          </div>
                        </div>
                        {open && (
                          <div style={{ padding: '0 clamp(12px,1.5vw,18px) 18px', background: baseBg }} onClick={ev => ev.stopPropagation()}>
                            <iframe title={`SoundCloud, ${mix.title}`} width="100%" height="120" frameBorder="0" scrolling="no" allow="autoplay" style={{ display: 'block' }}
                              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(mix.url)}&color=%23144889&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`} />
                            <div style={{ ...mono, fontSize: 9, color: C.light + '44', letterSpacing: '0.14em', marginTop: 6 }}>
                              <a href={mix.url} target="_blank" rel="noopener noreferrer" style={{ color: C.blue }}>Open on SoundCloud ↗</a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {artist.social?.soundcloud && (
                  <a href={artist.social.soundcloud} target="_blank" rel="noopener noreferrer"
                    style={{ ...mono, fontSize: 10, letterSpacing: '0.14em', color: C.light + '77', textDecoration: 'none', border: `1px solid ${C.light}1a`, padding: '12px 18px', textTransform: 'uppercase', transition: 'all 0.2s', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.light + '77'; e.currentTarget.style.borderColor = C.light + '1a'; }}
                  >SoundCloud ↗</a>
                )}
                {artist.social?.spotify && (
                  <a href={artist.social.spotify} target="_blank" rel="noopener noreferrer"
                    style={{ ...mono, fontSize: 10, letterSpacing: '0.14em', color: C.light + '77', textDecoration: 'none', border: `1px solid ${C.light}1a`, padding: '12px 18px', textTransform: 'uppercase', transition: 'all 0.2s', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.light + '77'; e.currentTarget.style.borderColor = C.light + '1a'; }}
                  >Spotify ↗</a>
                )}
              </div>
            </div>
          </R>
        </section>
      )}

      {/* ── APPEARANCES ── */}
      {events.length > 0 && (
        <section style={{
          padding: 'clamp(60px, 10vh, 96px) clamp(20px, 4vw, 56px)',
          borderTop: `1px solid ${C.light}0e`,
        }}>
          <R>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: '0.2em', color: C.blue, marginBottom: 8 }}>// APPEARANCES</div>
              <h2 style={{
                ...briq, fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 700, lineHeight: 0.83, letterSpacing: '-0.04em',
                color: C.light, marginBottom: 48,
              }}>On the dancefloor<span style={{ color: C.blue }}>.</span></h2>

              {upcoming.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{
                    ...mono, fontSize: 10, color: C.blue,
                    letterSpacing: '0.18em', marginBottom: 16,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, display: 'inline-block' }} />
                    UPCOMING
                  </div>
                  {upcoming.map((ev, i) => <EventAppearanceRow key={i} ev={ev} last={i === upcoming.length - 1} />)}
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <div style={{ ...mono, fontSize: 10, color: C.light + '33', letterSpacing: '0.2em', marginBottom: 16 }}>// ARCHIVE</div>
                  {past.map((ev, i) => <EventAppearanceRow key={i} ev={ev} last={i === past.length - 1} />)}
                </div>
              )}
            </div>
          </R>
        </section>
      )}

      {/* ── BACK NAV ── */}
      <section style={{
        background: C.darkSoft,
        padding: 'clamp(32px, 5vh, 56px) clamp(20px, 4vw, 56px)',
        borderTop: `1px solid ${C.light}0e`,
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <a href="/artists.html" style={{
            ...mono, fontSize: 11, letterSpacing: '0.16em',
            color: C.light + '66', textDecoration: 'none',
            textTransform: 'uppercase', transition: 'color 0.2s',
            display: 'inline-flex', alignItems: 'center', minHeight: 44,
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.blue}
          onMouseLeave={e => e.currentTarget.style.color = C.light + '66'}
          >← All artists</a>
          <a href="/index.html" style={{
            ...mono, fontSize: 11, letterSpacing: '0.16em',
            color: C.light + '66', textDecoration: 'none',
            textTransform: 'uppercase', transition: 'color 0.2s',
            display: 'inline-flex', alignItems: 'center', minHeight: 44,
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.blue}
          onMouseLeave={e => e.currentTarget.style.color = C.light + '66'}
          >Home →</a>
        </div>
      </section>

      <window.Footer8 banner={false} />
    </div>
  );
}
window.ArtistPage = ArtistPage;
