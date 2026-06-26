/* ============================================
   Hertz v8, Page sections
   Events · Manifesto · Family · Gallery · Merch · Footer
   Uses palette Cv8, hooks R8/useInView from main app file.
   ============================================ */

/* ═══════════════════════════════════════════
   EVENTS, Upcoming + Archive, polaroid cards
   ═══════════════════════════════════════════ */
function EventsHorizontal8() {
  const C = window.Cv8;
  const UPCOMING = window.UPCOMING_EVENTS || [];
  const PAST = window.PAST_EVENTS || [];

  const scrollStyle = {
    display: 'flex', gap: 14,
    overflowX: 'auto', overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    padding: '0 clamp(20px, 4vw, 56px) 8px',
  };

  return (
    <section id="events" style={{
      background: C.light, color: C.dark,
      padding: 'clamp(60px, 10vh, 120px) 0 clamp(48px, 8vh, 96px)',
      position: 'relative',
      backgroundImage: `
        linear-gradient(${C.dark}05 1px, transparent 1px),
        linear-gradient(90deg, ${C.dark}05 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>
      <style>{`.hz-events-scroll::-webkit-scrollbar { display: none; }`}</style>

      {/* Section header */}
      <div style={{
        padding: '0 clamp(20px, 4vw, 56px)', marginBottom: 56,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 24, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '0.2em', color: C.dark + '66', marginBottom: 8,
          }}>// 01 / EVENTS</div>
          <h2 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            fontWeight: 700, lineHeight: 0.83,
            letterSpacing: '-0.05em', color: C.dark,
          }}>What's next<span style={{ color: C.blue }}>.</span></h2>
        </div>
        <a href="/events.html" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, fontWeight: 600, letterSpacing: '0.16em',
          color: C.dark, textDecoration: 'none', textTransform: 'uppercase',
          borderBottom: `1px solid ${C.dark}`, paddingBottom: 4,
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.dark; e.currentTarget.style.borderColor = C.dark; }}
        >All events →</a>
      </div>

      {/* ── UPCOMING ── */}
      <div style={{ padding: '0 clamp(20px, 4vw, 56px)', marginBottom: 20 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '0.2em', color: C.blue, textTransform: 'uppercase',
        }}>
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: C.blue }} />
          Upcoming
        </div>
      </div>
      <div className="hz-events-scroll" style={scrollStyle}>
        {UPCOMING.map((e, i) => (
          <EventCard8 key={i} card={{ ...e, status: 'upcoming' }} />
        ))}
      </div>

      {/* ── THE ARCHIVE ── */}
      <div style={{ padding: '0 clamp(20px, 4vw, 56px)', marginTop: 56, marginBottom: 20 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '0.2em', color: C.dark + '55', textTransform: 'uppercase',
        }}>The Archive</div>
      </div>
      <div className="hz-events-scroll" style={scrollStyle}>
        {PAST.map((e, i) => (
          <EventCard8 key={i} card={{ ...e, status: 'past' }} />
        ))}
      </div>

      {/* Swipe hint */}
      <div style={{
        padding: '16px clamp(20px, 4vw, 56px) 0',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.18em', color: C.dark + '44',
      }}>
        <span style={{ fontSize: 14 }}>←</span>
        <span>SWIPE TO EXPLORE</span>
        <span style={{ fontSize: 14 }}>→</span>
      </div>
    </section>
  );
}

/* ─── Polaroid-style event card ──────────── */
function EventCard8({ card }) {
  const C = window.Cv8;
  const isPast = card.status === 'past';
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <article
      style={{
        flex: '0 0 auto',
        width: 'clamp(230px, 20vw, 290px)',
        background: C.dark,
        border: `1px solid ${C.light}15`,
        display: 'flex', flexDirection: 'column',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        transition: 'border-color 0.25s, opacity 0.25s',
        opacity: isPast ? 0.78 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.light + '40';
        e.currentTarget.style.opacity = '1';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.light + '15';
        e.currentTarget.style.opacity = isPast ? '0.78' : '1';
      }}
    >
      {/* ── MEDIA ZONE, uniform 4:5, posters cover-cropped ── */}
      <div style={{
        aspectRatio: '3875 / 5463',
        background: '#0b0b12',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {card.poster && !imgFailed ? (
          <img
            src={card.poster}
            alt={card.title}
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            loading="lazy"
          />
        ) : card.comingSoon ? (
          <div style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            lineHeight: 0.92, letterSpacing: '0.02em', textAlign: 'center', color: C.light, textTransform: 'uppercase',
          }}>
            <span style={{ display: 'block', fontSize: 'clamp(14px, 2.2vw, 18px)', fontWeight: 200, color: C.light + 'cc' }}>COMING</span>
            <span style={{ display: 'block', fontSize: 'clamp(24px, 4.2vw, 34px)', fontWeight: 700 }}>SOON<span style={{ color: C.blue }}>.</span></span>
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: 24, textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
              fontSize: 'clamp(20px, 3.5vw, 34px)', fontWeight: 700,
              letterSpacing: '-0.04em', color: C.light + '1e',
            }}>{card.date}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '0.2em',
              color: C.light + '28', textTransform: 'uppercase',
            }}>{card.venue}</div>
          </div>
        )}
        {/* Event type badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '0.14em',
          color: C.light, background: 'rgba(8,8,13,0.76)',
          backdropFilter: 'blur(6px)', padding: '4px 8px',
          textTransform: 'uppercase',
        }}>{card.type || 'Event'}</div>
      </div>

      {/* ── FOOTER INFO PANEL ── */}
      <div style={{
        padding: '14px 16px 18px',
        borderTop: `1px solid ${C.light}15`,
        display: 'flex', flexDirection: 'column', gap: 5,
        alignItems: card.comingSoon ? 'center' : 'flex-start',
        textAlign: card.comingSoon ? 'center' : 'left',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: isPast ? C.gray : C.blue,
        }}>
          {isPast ? '// PAST' : '// UPCOMING'} · {card.date}
        </div>
        {!card.comingSoon && (
          <div style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.2,
            color: isPast ? C.light + 'aa' : C.light,
          }}>{card.title}</div>
        )}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '0.08em',
          color: C.gray, textTransform: 'uppercase',
        }}>{card.comingSoon ? card.city : `${card.venue} · ${card.city}`}</div>
        {!isPast && card.ctaLabel && (
          <a href={card.ctaLink || '#'} style={{
            marginTop: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.16em',
            color: C.blue, textDecoration: 'none',
            textTransform: 'uppercase', display: 'inline-flex',
            alignItems: 'center', minHeight: 36,
          }}>{card.ctaLabel} →</a>
        )}
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   MANIFESTO, clubbers tone
   ═══════════════════════════════════════════ */
function Manifesto8() {
  const C = window.Cv8;
  const R = window.R8;
  return (
    <section id="manifesto" style={{
      background: C.dark, color: C.light,
      padding: 'clamp(60px, 10vh, 120px) clamp(20px, 4vw, 56px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 40, right: 40,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '0.2em', color: C.light + '44',
      }}>// 02 / MANIFESTO</div>

      <style>{`
        .hz-grid-12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; max-width: 1400px; margin: 0 auto; }
        .hz-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 80px); max-width: 1400px; margin: 0 auto; align-items: center; }
        .hz-span-full { grid-column: 1 / -1; }
        .hz-span-7 { grid-column: span 7; }
        .hz-span-5 { grid-column: span 5; }
        .hz-span-4 { grid-column: span 4; }
        .hz-span-3 { grid-column: span 3; }
        .hz-man-photo { position: relative; overflow: hidden; height: 100%; min-height: 480px; background: ${C.darkSoft}; }
        .hz-man-divider { border-top: 1px solid ${C.light}1a; margin: clamp(28px, 4vw, 44px) 0 clamp(22px, 3vw, 32px); }
        @media (max-width: 850px) {
          .hz-grid-12, .hz-grid-2 { display: flex !important; flex-direction: column !important; gap: 48px !important; }
          .hz-man-photo { height: auto; min-height: 0; aspect-ratio: 4/5; }
        }
      `}</style>
      <div className="hz-grid-12">
        <R className="hz-span-full" style={{ marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 9vw, 9rem)',
            fontWeight: 700, lineHeight: 0.83,
            letterSpacing: '-0.05em', color: C.light,
            marginTop: 24,
          }}>
            From <span style={{ color: C.blue, fontStyle: 'italic', fontWeight: 500 }}>clubbers</span>,<br />
            for <span style={{ color: C.blue, fontStyle: 'italic', fontWeight: 500 }}>clubbers</span>
            <span style={{ color: C.blue }}>.</span>
          </h2>
        </R>

        <R delay={0.1} className="hz-span-7" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.2em', color: C.blue,
            marginBottom: 18,
          }}>// CHAPTER 01 / ORIGIN</div>
          <p style={{
            fontSize: 'clamp(16px, 1.55vw, 19px)', lineHeight: 1.75,
            color: C.light + 'd0', marginBottom: 20, maxWidth: '60ch',
            textWrap: 'pretty',
          }}>
            The Hertz collective was born in Bologna in 2023, out of one simple conviction: the night was turning into something to watch, and less and less something to live, rooms built for the camera, with the music stuck somewhere in the background.
          </p>
          <p style={{
            fontSize: 'clamp(16px, 1.55vw, 19px)', lineHeight: 1.75,
            color: C.light + '9c', maxWidth: '60ch', textWrap: 'pretty',
          }}>
            So we put the attention back on what actually matters: the selection, the dancefloor, and the energy shared between clubbers. A floor where the record does the talking, where a good one can <span style={{ color: C.light }}>roll for nine minutes</span> before anyone checks the time, and the only reason to leave the house is one, to let the sound take over.
          </p>

          <div className="hz-man-divider" />

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.2em', color: C.blue,
            marginBottom: 16,
          }}>// CHAPTER 02 / THE ROOM</div>
          <p style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(22px, 2.6vw, 34px)',
            fontWeight: 700, lineHeight: 1.18,
            color: C.light, letterSpacing: '-0.025em',
            maxWidth: '18ch', textWrap: 'balance',
          }}>
            A room. A system. A crowd that came to listen. The rest is just volume.
          </p>
        </R>

        <R delay={0.2} className="hz-span-5" style={{ height: '100%' }}>
          <div className="hz-man-photo">
            <img src="/assets/hero-booth.jpg" alt="DJ booth at a Hertz night" loading="lazy" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'saturate(0.6) brightness(0.85) contrast(1.1)',
            }} />
          </div>
        </R>

        <R delay={0.4} className="hz-span-full" style={{ marginTop: 64 }}>
          <div style={{
            borderTop: `1px solid ${C.light}1a`,
            paddingTop: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32,
          }}>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
                marginBottom: 10,
              }}>// BASED IN</div>
              <div style={{
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 700,
                color: C.light, letterSpacing: '-0.02em',
              }}>Bologna, IT</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
                marginBottom: 10,
              }}>// SOUND</div>
              <div style={{
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 700,
                color: C.light, letterSpacing: '-0.02em',
              }}>Minimal &amp; deep-tech</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
                marginBottom: 10,
              }}>// ACTIVE SINCE</div>
              <div style={{
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 700,
                color: C.light, letterSpacing: '-0.02em',
              }}>2023</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
                marginBottom: 10,
              }}>// HOMES</div>
              <div style={{
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 700,
                color: C.light, letterSpacing: '-0.02em',
              }}>Kindergarten &middot; Buongiorno Classic</div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   BRAND IDENTITY, Clubbing Collective showcase
   ═══════════════════════════════════════════ */
function BrandIdentity8() {
  const C = window.Cv8;
  const R = window.R8;
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const briq = { fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif" };
  const GRAPHICS = [
    { img: 'assets/brand-1.jpg', cap: 'Made in (BO)' },
    { img: 'assets/brand-4.jpg', cap: 'Positive energy · Quality sound' },
    { img: 'assets/brand-2.jpg', cap: 'Clubbing Collective' },
    { img: 'assets/brand-3.jpg', cap: 'We live in frequency' },
  ];
  return (
    <section style={{ background: C.lightSoft, color: C.dark, padding: 'clamp(60px,10vh,120px) 0 clamp(48px,8vh,96px)', position: 'relative' }}>
      <style>{`.hz-brand-scroll::-webkit-scrollbar{display:none}`}</style>

      <div style={{ padding: '0 clamp(20px,4vw,56px)', marginBottom: 48 }}>
        <R>
          <div style={{ ...mono, fontSize: 11, letterSpacing: '0.2em', color: C.blue, marginBottom: 14 }}>// VISUAL IDENTITY</div>
          <h2 style={{ ...briq, fontSize: 'clamp(2.5rem,8vw,7rem)', fontWeight: 700, lineHeight: 0.83, letterSpacing: '-0.05em', color: C.dark }}>
            Clubbing<br />Collective<span style={{ color: C.blue }}>.</span>
          </h2>
        </R>
        <R delay={0.08}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px', marginTop: 28, ...mono, fontSize: 11, letterSpacing: '0.16em', color: C.dark + '99', textTransform: 'uppercase' }}>
            <span><span style={{ color: C.blue }}>+</span> Positive energy</span>
            <span><span style={{ color: C.blue }}>+</span> Quality sound</span>
            <span style={{ color: C.dark + '55' }}>©© Hertz.cc · Made in (BO)</span>
          </div>
        </R>
      </div>

      <R delay={0.12}>
        <div className="hz-brand-scroll" style={{ display: 'flex', gap: 16, overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', padding: '4px clamp(20px,4vw,56px) 8px' }}>
          {GRAPHICS.map((g, i) => (
            <figure
              key={i}
              style={{ flex: '0 0 auto', width: 'clamp(260px,74vw,360px)', aspectRatio: '4/5', position: 'relative', overflow: 'hidden', scrollSnapAlign: 'start', margin: 0, background: C.dark, border: `1px solid ${C.dark}12`, boxShadow: '0 20px 44px -22px rgba(8,8,13,0.5)', transition: 'transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 30px 60px -24px rgba(8,8,13,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 44px -22px rgba(8,8,13,0.5)'; }}
            >
              <img src={g.img} alt={`Hertz brand identity, ${g.cap}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <figcaption style={{ position: 'absolute', left: 12, bottom: 12, ...mono, fontSize: 9, letterSpacing: '0.14em', color: C.light, background: 'rgba(8,8,13,0.6)', backdropFilter: 'blur(6px)', padding: '4px 8px', textTransform: 'uppercase' }}>{String(i + 1).padStart(2, '0')}, {g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </R>

      <div style={{ padding: '16px clamp(20px,4vw,56px) 0', ...mono, fontSize: 10, letterSpacing: '0.18em', color: C.dark + '44', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>←</span><span>SWIPE TO EXPLORE</span><span style={{ fontSize: 14 }}>→</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FAMILY, residents
   ═══════════════════════════════════════════ */
function FamilySection8() {
  const C = window.Cv8;
  const R = window.R8;
  const RESIDENTS = window.RESIDENTS_DATA;
  const [active, setActive] = React.useState(0);

  return (
    <section id="family" style={{
      background: C.light, color: C.dark,
      padding: 'clamp(60px, 10vh, 120px) clamp(20px, 4vw, 56px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 40, right: 40,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '0.2em', color: C.dark + '55',
      }}>// 03 / THE FAMILY</div>

      <R>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: '0.2em', color: C.blue,
          marginBottom: 12,
        }}>// THE RESIDENTS</div>
        <h2 style={{
          fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
          fontSize: 'clamp(2.5rem, 8vw, 7rem)',
          fontWeight: 700, lineHeight: 0.83,
          letterSpacing: '-0.05em', color: C.dark,
          marginBottom: 64, maxWidth: 1200,
        }}>
          Four names.<br />One direction<span style={{ color: C.blue }}>.</span>
        </h2>
      </R>

      <div className="hz-grid-2" style={{ marginBottom: 64 }}>
        <R>
          <a href={`/artist-${RESIDENTS[active].slug}.html`} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{
              aspectRatio: '3/4', overflow: 'hidden', position: 'relative',
              background: C.lightSoft,
            }}>
              <img src={RESIDENTS[active].img} alt={RESIDENTS[active].name} loading="lazy" style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'saturate(0.7) contrast(1.1)',
                transition: 'filter 0.6s cubic-bezier(.22,1,.36,1)',
              }} />
            </div>
            <div style={{
              padding: '12px 0',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '0.14em',
              color: C.blue, textTransform: 'uppercase',
            }}>View profile →</div>
          </a>
        </R>

        <div>
          <R delay={0.1}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '0.2em', color: C.blue,
              marginBottom: 16,
            }}>// SELECTED / {RESIDENTS[active].n}</div>
            <h3 style={{
              fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700, lineHeight: 0.83,
              letterSpacing: '-0.04em', color: C.dark,
              marginBottom: 16, transition: 'all 0.5s',
            }}>{RESIDENTS[active].name}</h3>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, color: C.dark + '88',
              letterSpacing: '0.1em', marginBottom: 32,
              textTransform: 'uppercase',
            }}>{RESIDENTS[active].role}</p>

            <div style={{
              borderTop: `1px solid ${C.dark}15`,
              paddingTop: 24,
            }}>
              {RESIDENTS.map((r, i) => (
                <a
                  key={r.name}
                  href={`/artist-${r.slug}.html`}
                  onMouseEnter={() => setActive(i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '14px 0',
                    borderBottom: `1px solid ${C.dark}10`,
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline',
                    transition: 'all 0.3s',
                    paddingLeft: i === active ? 12 : 0,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, color: C.dark + '55',
                    }}>{r.n}</span>
                    <span style={{
                      fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                      fontSize: 'clamp(16px, 2vw, 22px)',
                      fontWeight: 700,
                      color: i === active ? C.blue : C.dark + 'dd',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.3s',
                    }}>{r.name}</span>
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: i === active ? C.blue : C.dark + '33',
                    transition: 'color 0.3s',
                  }}>→</span>
                </a>
              ))}
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   COLLAB, partner venues / homes
   ═══════════════════════════════════════════ */
function CollabSection8() {
  const C = window.Cv8;
  const R = window.R8;

  const PARTNERS = [
    { logo: '/assets/collab-kindergarten.png',       name: 'Kindergarten' },
    { logo: '/assets/collab-buongiorno-classic.png', name: 'Buongiorno Classic' },
  ];

  return (
    <section id="partners" style={{
      background: C.dark, color: C.light,
      padding: 'clamp(64px, 11vh, 130px) clamp(20px, 4vw, 56px)',
      borderTop: `1px solid ${C.light}0a`,
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        .hz-collab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 2.4vw, 28px); max-width: 920px; margin: 0 auto; }
        @media (max-width: 600px) { .hz-collab-grid { grid-template-columns: 1fr; } }
        .hz-collab-card { transition: transform .45s cubic-bezier(.22,1,.36,1), border-color .45s; }
        .hz-collab-card:hover { transform: translateY(-6px); border-color: ${C.blue}66; }
        .hz-collab-card:hover img { opacity: 1; }
      `}</style>

      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <R>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '0.2em', color: C.blue,
            marginBottom: 'clamp(28px, 5vw, 48px)',
          }}>// COLLABORIAMO CON</div>
        </R>

        <R delay={0.08}>
          <div className="hz-collab-grid">
            {PARTNERS.map((p) => (
              <figure key={p.name} className="hz-collab-card" style={{
                margin: 0, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #15151d 0%, #0f0f16 100%)',
                border: `1px solid ${C.light}10`,
                padding: 'clamp(44px, 6vw, 76px) clamp(24px, 4vw, 48px)',
                minHeight: 'clamp(220px, 26vw, 300px)',
              }}>
                <img
                  src={p.logo} alt={p.name} loading="lazy"
                  style={{
                    height: 'clamp(60px, 8.5vw, 100px)', width: 'auto', maxWidth: '74%',
                    objectFit: 'contain', opacity: 0.9, transition: 'opacity .45s',
                    filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.45))',
                  }}
                />
                <figcaption style={{
                  position: 'absolute',
                  left: 'clamp(16px, 2vw, 22px)', bottom: 'clamp(16px, 2vw, 22px)',
                  background: C.blue, color: '#ffffff',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.16em',
                  textTransform: 'uppercase', lineHeight: 1,
                  padding: '6px 11px',
                }}>{p.name}</figcaption>
              </figure>
            ))}
          </div>
        </R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   GALLERY, horizontal scroll
   ═══════════════════════════════════════════ */
function GallerySection8() {
  const C = window.Cv8;
  const sectionRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const IMGS = [
    { src: 'uploads/24.04_Hertz-95.jpg',  ratio: '4/5' },
    { src: 'uploads/24.04_Hertz-17.jpg',  ratio: '3/4' },
    { src: 'uploads/24.04_Hertz-58.jpg',  ratio: '4/5' },
    { src: 'uploads/24.04_Hertz-62.jpg',  ratio: '1'   },
    { src: 'uploads/24.04_Hertz-73.jpg',  ratio: '3/4' },
    { src: 'uploads/24.04_Hertz-86.jpg',  ratio: '4/5' },
    { src: 'uploads/26.12_Hertz-86.jpg',  ratio: '3/4' },
    { src: 'uploads/24.04_Hertz-18.jpg',  ratio: '4/5' },
    { src: 'uploads/24.04_Hertz-24.jpg',  ratio: '3/4' },
    { src: 'uploads/24.04_Hertz-71.jpg',  ratio: '1'   },
    { src: 'uploads/24.04_Hertz-129.jpg', ratio: '3/4' },
    { src: 'uploads/26.12_Hertz-28.jpg',  ratio: '4/5' },
    { src: 'uploads/26.12_Hertz-55.jpg',  ratio: '3/4' },
  ];

  React.useEffect(() => {
    let pending = false;
    const oh = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const p = 1 - Math.max(0, Math.min(1, (rect.top + rect.height/2) / window.innerHeight));
          setProgress(p);
        }
        pending = false;
      });
    };
    window.addEventListener('scroll', oh, { passive: true });
    oh();
    return () => window.removeEventListener('scroll', oh);
  }, []);

  return (
    <section ref={sectionRef} id="sounds" style={{
      background: C.dark, color: C.light,
      padding: 'clamp(60px, 10vh, 120px) 0',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0 clamp(20px, 4vw, 56px)', marginBottom: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '0.2em', color: C.blue,
            marginBottom: 12,
          }}>// 04 / THE ARCHIVE</div>
          <h2 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700, lineHeight: 0.83,
            letterSpacing: '-0.05em', color: C.light,
          }}>Nights on<br />record<span style={{ color: C.blue }}>.</span></h2>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: C.light + '55', letterSpacing: '0.15em',
          textAlign: 'right',
        }}>SCROLL → ARCHIVE<br />
          <span style={{ color: C.blue }}>{Math.round(progress * 100)}%</span>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 16,
        transform: `translateX(${-progress * 50}%)`,
        willChange: 'transform',
      }}>
        {IMGS.map((img, i) => (
          <div key={i} style={{
            minWidth: 'clamp(240px, 28vw, 400px)',
            aspectRatio: img.ratio,
            overflow: 'hidden', position: 'relative',
          }}>
            <img src={img.src} alt="Hertz night, archive" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'saturate(0.65) brightness(0.85) contrast(1.1)',
            }} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MERCH, Drop 01
   ═══════════════════════════════════════════ */
function MerchTeaser8() {
  const C = window.Cv8;
  const R = window.R8;
  const [email, setEmail] = React.useState('');
  const [joined, setJoined] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || submitting) return;
    setSubmitting(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (_) {}
    setJoined(true);
    setSubmitting(false);
  };
  return (
    <section id="merch" style={{
      background: C.light, color: C.dark,
      padding: 'clamp(60px, 10vh, 120px) clamp(20px, 4vw, 56px)',
      position: 'relative', overflow: 'hidden',
      backgroundImage: `
        linear-gradient(${C.dark}05 1px, transparent 1px),
        linear-gradient(90deg, ${C.dark}05 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>
      <div className="hz-grid-12" style={{ alignItems: 'center' }}>
        <R className="hz-span-7">
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '0.2em', color: C.blue,
            marginBottom: 16,
          }}>// 05 / DROP 01 · COMING SOON</div>
          <h2 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            fontWeight: 700, lineHeight: 0.83,
            letterSpacing: '-0.05em', color: C.dark,
            marginBottom: 24,
          }}>
            Wear the<br />frequency<span style={{ color: C.blue }}>.</span>
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            color: C.dark + '88', lineHeight: 1.7,
            maxWidth: 540, marginBottom: 32, textWrap: 'pretty',
          }}>
            A capsule built for the dancefloor. Limited numbered runs, no compromise.
            Coming soon, leave your address to know first.
          </p>
          {!joined ? (
            <form onSubmit={submit} style={{
              display: 'flex', gap: 0, maxWidth: 460,
              border: `1px solid ${C.dark}33`,
            }}>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.cc"
                style={{
                  flex: 1, padding: '14px 16px',
                  border: 'none', outline: 'none',
                  background: 'transparent', color: C.dark,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13, letterSpacing: '0.06em',
                }}
              />
              <button type="submit" style={{
                background: C.dark, color: C.light, border: 'none',
                padding: '14px 24px', cursor: 'pointer',
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 700, fontSize: 12, letterSpacing: '0.12em',
                textTransform: 'uppercase', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.blue}
              onMouseLeave={e => e.currentTarget.style.background = C.dark}
              >{submitting ? '...' : 'Notify me →'}</button>
            </form>
          ) : (
            <div style={{
              padding: '14px 18px', border: `1px solid ${C.blue}`,
              color: C.blue, fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: '0.12em', display: 'inline-block',
            }}>● ON THE LIST, see you on the dancefloor.</div>
          )}
        </R>

        <R delay={0.15} className="hz-span-5" style={{ width: '100%' }}>
          <div style={{ position: 'relative' }}>

            {/* Header label row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.16em', color: C.dark + '55',
            }}>
              <span>HZ.MERCH / DROP 01</span>
              <span style={{ color: C.blue }}>LIMITED ↗</span>
            </div>

            {/* Dark card, slightly rotated for editorial feel */}
            <div style={{
              background: C.dark,
              padding: '28px 24px 20px',
              transform: 'rotate(-1.5deg)',
              transformOrigin: '50% 100%',
              boxShadow: '10px 20px 60px rgba(0,0,0,0.22)',
              position: 'relative',
            }}>

              {/* Limited edition badge */}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: C.blue,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, letterSpacing: '0.22em',
                color: C.light, padding: '5px 10px',
                textTransform: 'uppercase',
              }}>001/200</div>

              {/* Product photo, transparent PNG on white */}
              <div style={{
                background: '#ffffff',
                aspectRatio: '3/4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: 20,
              }}>
                <img
                  src="/assets/merch-lanyard-drop01.png"
                  alt="Hertz lanyard, Drop 01"
                  style={{ width: '75%', objectFit: 'contain' }}
                />
              </div>

              {/* Specs row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12, paddingTop: 16,
                borderTop: `1px solid ${C.light}1a`,
              }}>
                {[
                  ['ITEM',     'LANYARD'],
                  ['MATERIAL', 'WOVEN NYLON'],
                  ['STATUS',   'COMING SOON'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, letterSpacing: '0.16em',
                      color: C.light + '3a', marginBottom: 4,
                    }}>{k}</div>
                    <div style={{
                      fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
                      fontSize: 12, fontWeight: 700,
                      color: k === 'STATUS' ? C.blue : C.light,
                      letterSpacing: '-0.01em',
                    }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer label */}
            <div style={{
              marginTop: 14,
              display: 'flex', justifyContent: 'space-between',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '0.14em', color: C.dark + '44',
            }}>
              <span>WIDTH 5cm · BLACK</span>
              <span>COMING SOON</span>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer8() {
  const C = window.Cv8;
  return (
    <>
      <section style={{
        background: C.light, color: C.dark,
        padding: 'clamp(60px, 10vh, 100px) clamp(20px, 4vw, 56px)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '0.2em', color: C.blue, marginBottom: 16,
          }}>FROM CLUBBERS FOR CLUBBERS</div>
          <h2 style={{
            fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            fontWeight: 700, lineHeight: 0.83, letterSpacing: '-0.05em', color: C.dark,
          }}>Groove is<br />the key<span style={{ color: C.blue }}>.</span></h2>
        </div>
      </section>
    <footer style={{
      background: C.dark, color: C.light,
      padding: 'clamp(60px, 10vh, 100px) clamp(20px, 4vw, 56px) clamp(24px, 4vh, 48px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 40, marginBottom: 56,
        }}>
          <div>
            <img src="/assets/hertz-logo-header.png" alt="Hertz" style={{ height: 30, opacity: 0.9, marginBottom: 16 }} />
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: C.light + '66', lineHeight: 1.8,
            }}>
              hertz.cc<br />info@hertz.cc<br />Bologna · IT
            </p>
          </div>
          <div>
            <h4 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
              marginBottom: 16,
            }}>// NAVIGATE</h4>
            {[['Events','/events.html'],['Manifesto','/manifesto.html'],['Artists','/artists.html'],['Music','/music.html'],['Merch','/merch.html'],['Media','/media.html'],['Archive','/archive.html']].map(([l,h]) => (
              <a key={l} href={h} style={{
                display: 'block', color: C.light + '99', textDecoration: 'none',
                fontSize: 14, padding: '7px 0', transition: 'color 0.2s',
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif", fontWeight: 500,
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.blue}
              onMouseLeave={e => e.currentTarget.style.color = C.light + '99'}
              >{l} →</a>
            ))}
          </div>
          <div>
            <h4 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
              marginBottom: 16,
            }}>// FREQUENCIES</h4>
            {[
              { l: 'Instagram', href: 'https://instagram.com/hertz.cc' },
              { l: 'Spotify', href: '#' },
              { l: 'SoundCloud', href: '#' },
              { l: 'Mixcloud', href: '#' },
            ].map(x => (
              <a key={x.l} href={x.href} target={x.href.startsWith('http') ? '_blank' : undefined} rel={x.href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{
                display: 'block', color: C.light + '99', textDecoration: 'none',
                fontSize: 14, padding: '7px 0', transition: 'color 0.2s',
                fontFamily: "'HelveticaNeue', 'Helvetica Neue', Helvetica, sans-serif", fontWeight: 500,
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.blue}
              onMouseLeave={e => e.currentTarget.style.color = C.light + '99'}
              >{x.l} →</a>
            ))}
          </div>
          <div>
            <h4 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '0.2em', color: C.light + '55',
              marginBottom: 16,
            }}>// SAFE SPACE</h4>
            <p style={{ fontSize: 12, color: C.light + '66', lineHeight: 1.7, textWrap: 'pretty' }}>
              No harassment, no hate, no discrimination. Respect boundaries, yours and others'. The dancefloor is for everyone.
            </p>
          </div>
        </div>
        <div style={{
          paddingTop: 24, borderTop: `1px solid ${C.light}1a`,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: C.light + '40', letterSpacing: '0.1em',
        }}>
          <span>© 2026 Hertz, from clubbers to clubbers</span>
          <span>HZ.CC / V8</span>
        </div>
      </div>
    </footer>
    </>
  );
}

/* Export to window so the main app can compose them */
Object.assign(window, {
  EventsHorizontal8, EventCard8, Manifesto8, BrandIdentity8, FamilySection8,
  CollabSection8, GallerySection8, MerchTeaser8, Footer8,
});
