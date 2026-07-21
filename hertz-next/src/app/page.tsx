/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Section from '@/components/ui/Section'
import { upcoming, dowDate, eventSlug, type ResidentSlug } from '@/content/events'
import { ARTISTS } from '@/content/artists'
import { ARTICLES } from '@/content/media'
import styles from './home.module.css'

const ROSTER: ResidentSlug[] = [
  'federico-apadula',
  'tommaso-manco',
  'alberto-b',
  'leonardo-giusti',
]

const ARCHIVE_PHOTOS = [
  '/assets/archivio-web/26.12_Hertz-104.jpg',
  '/assets/archivio-web/26.12_Hertz-108.jpg',
  '/assets/archivio-web/26.12_Hertz-181.jpg',
  '/assets/archivio-web/26.12_Hertz-113.jpg',
  '/assets/archivio-web/26.12_Hertz-110.jpg',
  '/assets/archivio-web/26.12_Hertz-185.jpg',
]

export default function Home() {
  const up = upcoming()
  const next = up[0]
  const feature = up.find((e) => e.poster) ?? next

  const mixes = ROSTER.flatMap((slug) =>
    ARTISTS[slug].mixes.map((m) => ({ ...m, artist: ARTISTS[slug].name })),
  )
    .sort((a, b) => (b.tag === 'Featured' ? 1 : 0) - (a.tag === 'Featured' ? 1 : 0))
    .slice(0, 5)

  return (
    <main id="main">
      {/* ═══ 01 · HERO (signal) ═══ */}
      <Section surface="signal" space="none" container={false} className={styles.hero} id="top">
        <div className="hz-container" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <p className={`${styles.heroKicker} hz-mono`}>
            Clubbing collective · Bologna · since 2023
          </p>
          <div className={styles.heroInner}>
            <div>
              <h1 className={styles.heroTitle}>
                From clubbers,
                <br />
                <em>for clubbers.</em>
              </h1>
              <p className={styles.heroSub}>
                Hertz is a minimal / deep-tech clubbing collective in Bologna. A resident
                night, a roster, an editorial — built around the selection and the
                dancefloor, not the camera.
              </p>
              {next && (
                <div className={styles.heroNext}>
                  <div className={styles.heroNextMeta}>
                    <span className={`${styles.heroNextLabel} hz-mono`}>Next · N°{next.n}</span>
                    <span className={styles.heroNextTitle}>{next.title}</span>
                    <span className="hz-mono" style={{ color: 'var(--hz-ink-mute)' }}>
                      {dowDate(next)} · {next.venue} · {next.city}
                    </span>
                  </div>
                  <div className={styles.heroActions}>
                    <Link href="/events" className={`${styles.btn} ${styles.btnSolid}`}>
                      Tickets
                    </Link>
                    <Link href="/events" className={`${styles.btn} ${styles.btnGhost}`}>
                      All events
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <figure className={styles.heroMedia}>
              <img
                src="/assets/hero-booth.jpg"
                alt="Hertz — the DJ booth during an event"
                className={styles.heroPhoto}
              />
              <figcaption className={`${styles.heroPhotoCap} hz-mono`}>
                <span>hertz.cc</span>
                <span>From clubbers to clubbers</span>
              </figcaption>
            </figure>
          </div>
        </div>
        <svg className={styles.wave} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,60 C180,60 220,60 320,60 C410,60 430,18 520,18 C610,18 620,102 720,102 C810,102 830,60 940,60 C1060,60 1160,60 1440,60" />
        </svg>
      </Section>

      {/* ═══ 02 · INTRODUCTION (signal) ═══ */}
      <Section surface="signal" space="lg" id="intro">
        <div className={styles.introGrid}>
          <p className={styles.introLead}>
            Independent nights in Bologna and across Emilia-Romagna — minimal &amp; deep
            tech, booked like we&rsquo;d pay to see them ourselves. The visual changes; the
            information stays stable.
          </p>
          <dl className={styles.introStats}>
            <div>
              <dt className="hz-mono">Base</dt>
              <dd>Bologna, IT</dd>
            </div>
            <div>
              <dt className="hz-mono">Since</dt>
              <dd>2023</dd>
            </div>
            <div>
              <dt className="hz-mono">Sound</dt>
              <dd>Minimal &amp; deep tech</dd>
            </div>
            <div>
              <dt className="hz-mono">Homes</dt>
              <dd>Kindergarten · Buongiorno Classic</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ═══ 03 · EVENTS (white) ═══ */}
      <Section surface="white" space="lg" id="events">
        <div className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>01 / Events</span>
          <h2 className={styles.secTitle}>On the calendar.</h2>
          <Link href="/events" className={styles.secLink}>
            Full calendar ↗
          </Link>
        </div>
        <div className={styles.eventsLayout}>
          <div className={styles.eventList}>
            {up.map((e) => (
              <Link key={e.n} href={`/events/${eventSlug(e)}`} className={styles.eventRow}>
                <span className={styles.eRowDate}>{dowDate(e)}</span>
                <span className={styles.eRowMain}>
                  <span className={styles.eRowTitle}>{e.title}</span>
                  <span className={styles.eRowVenue}>
                    {e.venue} · {e.city}
                  </span>
                </span>
                <span className={styles.eRowRight}>
                  <span
                    className={`${styles.status} ${e.onSale ? styles.statusOn : styles.statusSoon}`}
                  >
                    {e.onSale ? 'On sale' : 'Soon'}
                  </span>
                  <span className={styles.eRowArrow} aria-hidden="true">
                    ↗
                  </span>
                </span>
              </Link>
            ))}
            <Link href="/archive" className={styles.pastLink}>
              <span>Past events</span>
              <span>Archive ↗</span>
            </Link>
          </div>
          {feature && (
            <figure className={styles.eventFeature}>
              <img
                src={feature.poster || '/assets/hero-booth.jpg'}
                alt={`Poster — ${feature.title}`}
                loading="lazy"
              />
              <figcaption className={styles.eventFeatureCap}>
                <span>N°{feature.n}</span>
                <span>{dowDate(feature)}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      {/* ═══ 03 · MANIFESTO (ink — unico dark) ═══ */}
      <Section surface="ink" space="lg" id="manifesto">
        <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-md)' }}>
          02 / Manifesto · The floor is the medium
        </p>
        <div className={styles.manifestoGrid}>
          <div>
            <h2 className={styles.manifestoStatement}>
              A room. A system.
              <br />
              A crowd that came
              <br />
              to <em>listen.</em>
            </h2>
            <p className={styles.manifestoBody}>
              Hertz was born in Bologna in 2023, out of one conviction: the night was
              turning into something to watch, and less something to live. So we put the
              attention back on the selection, the dancefloor, and the energy shared
              between clubbers.
            </p>
            <Link href="/about" className={`${styles.btn} ${styles.btnGhost} ${styles.manifestoLink}`}>
              Read the manifesto ↗
            </Link>
          </div>
          <figure className={styles.manifestoPhoto}>
            <img src="/assets/crowd-floor.jpg" alt="People on the Hertz dancefloor" loading="lazy" />
          </figure>
        </div>
      </Section>

      {/* ═══ 04 · ARTISTS (cold-blue) ═══ */}
      <Section surface="cold-blue" space="lg" id="artists">
        <div className={styles.artistsHead}>
          <div>
            <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-sm)' }}>
              03 / Residents
            </p>
            <h2 className={styles.artistsTitle}>The family.</h2>
          </div>
          <p className={styles.artistsHint}>Select an artist →</p>
        </div>
        <div className={styles.artistList}>
          {ROSTER.map((slug, i) => {
            const a = ARTISTS[slug]
            return (
              <Link key={slug} href={`/artists/${slug}`} className={styles.artistRow}>
                <span className={styles.aNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.aName}>{a.name}</span>
                <span className={styles.aRole}>{a.role}</span>
                <span className={styles.aArrow} aria-hidden="true">
                  ↗
                </span>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ═══ 05 · MUSIC (paper) ═══ */}
      <Section surface="paper" space="lg" id="music">
        <div className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>04 / Music</span>
          <h2 className={styles.secTitle}>Current transmission.</h2>
          <a
            href="https://soundcloud.com/hertzclubbingcollective"
            target="_blank"
            rel="noreferrer"
            className={styles.secLink}
          >
            SoundCloud ↗
          </a>
        </div>
        <div className={styles.mixList}>
          {mixes.map((m, i) => (
            <a key={m.url} href={m.url} target="_blank" rel="noreferrer" className={styles.mixRow}>
              <span className={styles.mixNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.mixTitle}>{m.t}</span>
              <span className={styles.mixArtist}>{m.artist}</span>
              <span className={styles.mixTag}>{m.tag ?? 'Mix'}</span>
            </a>
          ))}
        </div>
      </Section>

      {/* ═══ 06 · MEDIA (white) ═══ */}
      <Section surface="white" space="lg" id="media">
        <div className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>05 / Media</span>
          <h2 className={styles.secTitle}>Reading the signal.</h2>
          <Link href="/media" className={styles.secLink}>
            All media ↗
          </Link>
        </div>
        <div className={styles.mediaGrid}>
          {ARTICLES.map((a, i) => (
            <Link
              key={a.slug}
              href={`/media/${a.slug}`}
              className={`${styles.mediaCard} ${i === 0 ? styles.mediaLead : ''}`}
            >
              <div className={styles.mcImg}>
                <img src={a.heroImage} alt={a.heroImageAlt} loading="lazy" />
              </div>
              <span className={styles.mcRubric}>{a.rubric}</span>
              <span className={styles.mcTitle}>{a.title}</span>
              <span className={styles.mcMeta}>
                {a.author} · {a.readingTimeMinutes} min
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ═══ 07 · ARCHIVE (white) ═══ */}
      <Section surface="white" space="lg" id="archive">
        <div className={styles.archiveHead}>
          <div>
            <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-sm)' }}>
              06 / Archive
            </p>
            <h2 className={styles.archiveTitle}>
              Wicked
              <br />
              nights.
            </h2>
          </div>
          <p className={styles.archiveIntro}>
            A moving archive of faces, rooms and fragments — Kindergarten, Numa, Cassero
            and more. Photography stays raw; the interface supplies the rhythm.
          </p>
        </div>
        <div className={styles.archiveStrip}>
          {ARCHIVE_PHOTOS.map((src, i) => (
            <figure key={src} className={styles.archiveCard}>
              <img src={src} alt="Hertz night — Kindergarten archive" loading="lazy" />
              <figcaption>
                <span>Kindergarten</span>
                <span>
                  {String(i + 1).padStart(2, '0')} / {ARCHIVE_PHOTOS.length}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Link
          href="/archive"
          className={`${styles.btn} ${styles.btnGhost}`}
          style={{ marginTop: 'var(--hz-space-lg)' }}
        >
          Open archive ↗
        </Link>
      </Section>

      {/* ═══ 08 · SHOP (paper) ═══ */}
      <Section surface="paper" space="lg" id="shop">
        <div className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>07 / Shop</span>
          <h2 className={styles.secTitle}>Hertz uniform.</h2>
          <Link href="/shop" className={styles.secLink}>
            Visit shop ↗
          </Link>
        </div>
        <div className={styles.shopCard}>
          <div className={styles.shopVisual}>
            <img src="/assets/merch-lanyard-drop01.png" alt="Hertz lanyard, Drop 01" loading="lazy" />
            <span className={`${styles.shopBadge} ${styles.status} ${styles.statusSoon}`}>
              Coming soon
            </span>
          </div>
          <div>
            <h3 className={styles.shopTitle}>Drop 01 — Lanyard</h3>
            <p className={styles.shopDesc}>
              Woven nylon, 5 cm, black. 200 pieces per drop, numbered 001–200, ships from
              Bologna. Reserve by email; we confirm shortly.
            </p>
            <div className={styles.shopSpecs}>
              <span>001 / 200</span>
              <span>Woven nylon</span>
              <span>Black · 5 cm</span>
            </div>
            <div className={styles.shopCats}>
              <span className={styles.shopCat}>Apparel · soon</span>
              <span className={styles.shopCat}>Outerwear · soon</span>
              <span className={styles.shopCat}>Headwear · soon</span>
            </div>
            <Link
              href="/shop"
              className={`${styles.btn} ${styles.btnSolid}`}
              style={{ marginTop: 'var(--hz-space-md)' }}
            >
              Reserve ↗
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══ 09 · BOOKING (signal) ═══ */}
      <Section surface="signal" space="lg" id="booking">
        <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-md)' }}>
          08 / Connect
        </p>
        <h2 className={styles.bookTitle}>Bring Hertz into your space.</h2>
        <div className={styles.bookActions}>
          <Link href="/bookings" className={styles.bookRow}>
            <span>Artist booking</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/bookings" className={styles.bookRow}>
            <span>Event collaboration</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/bookings" className={styles.bookRow}>
            <span>Press &amp; partnerships</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <a href="mailto:hertzbologna@gmail.com" className={styles.bookEmail}>
          hertzbologna@gmail.com ↗
        </a>
      </Section>
    </main>
  )
}
