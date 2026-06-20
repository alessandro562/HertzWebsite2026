/* ============================================
   HERTZ — Artist detail page template
   Requires: hertz-shared.jsx (Nav8, Footer8, Cv8, R8)
   Usage: <window.ArtistPage artist={ARTIST} events={EVENTS} />
   ============================================ */

function EventAppearanceRow({ ev }) {
  const C = window.Cv8;
  const isPast = ev.status === 'past';
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '8px 24px',
      padding: '16px 0',
      borderBottom: `1px solid ${C.light}0e`,
      alignItems: 'baseline',
      opacity: isPast ? 0.6 : 1,
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.14em',
        color: isPast ? C.light + '33' : C.blue,
        minWidth: 88,
      }}>{ev.day}</span>
      <span style={{
        fontFamily: "'Archivo', sans-serif",
        fontSize: 'clamp(14px, 1.6vw, 17px)', fontWeight: 700,
        color: C.light, letterSpacing: '-0.02em',
        flex: 1, minWidth: 160,
      }}>{ev.title}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, color: C.gray, letterSpacing: '0.1em',
      }}>{ev.venue}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, color: C.light + '22',
      }}>#{ev.n}</span>
    </div>
  );
}

function ArtistPage({ artist, events = [] }) {
  const C = window.Cv8;
  const R = window.R8;
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const briq = { fontFamily: "'Archivo', sans-serif" };
  const [imgFailed, setImgFailed] = React.useState(false);

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
              filter: 'saturate(0.4) brightness(0.3) contrast(1.15)',
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
                HZ — {artist.n} / RESIDENT
              </div>
              <h1 style={{
                ...briq,
                fontSize: 'clamp(2.2rem, 9vw, 9rem)',
                fontWeight: 800, lineHeight: 0.88, letterSpacing: '-0.04em',
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
            <p style={{
              fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.85,
              color: C.light + 'bb', textWrap: 'pretty',
            }}>{artist.bio}</p>
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
                  artist.social.soundcloud && ['SoundCloud', artist.social.soundcloud],
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

      {/* ── FEATURED SETS ── */}
      {artist.mixes && artist.mixes.length > 0 && (
        <section style={{
          background: C.darkSoft,
          padding: 'clamp(48px, 8vh, 80px) clamp(20px, 4vw, 56px)',
          borderTop: `1px solid ${C.light}0e`,
        }}>
          <R>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: '0.2em', color: C.blue, marginBottom: 24 }}>// FEATURED SETS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {artist.mixes.map((mix, i) => (
                  <a key={i} href={mix.url} target="_blank" rel="noopener noreferrer" style={{
                    background: C.dark, border: `1px solid ${C.light}18`,
                    padding: '20px 24px', textDecoration: 'none',
                    flex: '1 0 220px', maxWidth: 360,
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.light + '18'}
                  >
                    <div style={{ ...mono, fontSize: 10, color: C.light + '33', letterSpacing: '0.16em', marginBottom: 8, textTransform: 'uppercase' }}>{mix.platform}</div>
                    <div style={{ ...briq, fontSize: 17, fontWeight: 700, color: C.light, letterSpacing: '-0.02em', marginBottom: 6 }}>{mix.title}</div>
                    {mix.duration && <div style={{ ...mono, fontSize: 10, color: C.gray }}>{mix.duration}</div>}
                    <div style={{ ...mono, fontSize: 10, color: C.blue, marginTop: 12 }}>Listen →</div>
                  </a>
                ))}
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
                fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.04em',
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
                  {upcoming.map((ev, i) => <EventAppearanceRow key={i} ev={ev} />)}
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <div style={{ ...mono, fontSize: 10, color: C.light + '33', letterSpacing: '0.2em', marginBottom: 16 }}>// ARCHIVE</div>
                  {past.map((ev, i) => <EventAppearanceRow key={i} ev={ev} />)}
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

      <window.Footer8 />
    </div>
  );
}
window.ArtistPage = ArtistPage;
