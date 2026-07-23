/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PosterFX from '@/components/ui/PosterFX'
import HomeHero from '@/components/home/HomeHero'
import HeroKinetic from '@/components/home/HeroKinetic'
import KineticBand from '@/components/home/KineticBand'
import BrandIdentity from '@/components/home/BrandIdentity'
import Partners from '@/components/home/Partners'
import MerchWaitlist from '@/components/home/MerchWaitlist'
import Reveal, { Stagger, StaggerItem } from '@/motion/Reveal'
import SignatureTitle from '@/motion/SignatureTitle'
import MaskImage from '@/motion/MaskImage'
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

  const nextEvent = next
    ? {
        n: next.n,
        title: next.title,
        venue: next.venue,
        city: next.city,
        date: dowDate(next),
        slug: eventSlug(next),
        onSale: next.onSale,
        comingSoon: next.comingSoon,
      }
    : undefined

  // Hero: la sequenza "Print Interruption" È il primo stato della hero e si
  // trasforma nella hero runtime (stessa <section> Signal, nessun intro/preloader).
  // Rollback semplice alla hero classica: build con NEXT_PUBLIC_HERO=classic.
  const heroClassic = process.env.NEXT_PUBLIC_HERO === 'classic'

  return (
    <main id="main">
      {/* ═══ 01 · HERO (signal · solo tipografia cinetica, nessuna foto) ═══ */}
      {heroClassic ? <HomeHero next={nextEvent} /> : <HeroKinetic next={nextEvent} />}

      {/* ═══ 02 · INTRODUCTION (signal) ═══ */}
      <Section surface="signal" space="lg" id="intro">
        <div className={styles.introGrid}>
          <Reveal as="p" variant="mask" duration={0.9} className={styles.introLead}>
            Independent nights across Bologna and central Italy — minimal &amp; deep tech,
            booked like we&rsquo;d pay to see them ourselves.
          </Reveal>
          <Reveal variant="up" delay={0.15}>
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
          </Reveal>
        </div>
      </Section>

      {/* ═══ ORDER / DISORDER — banda cinetica (ink, edge-to-edge) ═══ */}
      <KineticBand
        primary={['ORDER', 'DISORDER']}
        secondary={['44.49° N', '11.34° E', 'BOLOGNA', 'MINIMAL', 'DEEP TECH']}
        labelLeft="01 / SIGNAL"
        labelRight="FROM CLUBBERS · FOR CLUBBERS"
      />

      {/* ═══ 02b · VISUAL IDENTITY (paper) ═══ */}
      <Section surface="paper" space="lg" id="identity">
        <Reveal variant="up">
          <BrandIdentity />
        </Reveal>
      </Section>

      {/* ═══ 03 · EVENTS (white) ═══ */}
      <Section surface="white" space="lg" id="events">
        <Reveal variant="up" className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>01 / Events</span>
          <h2 className={styles.secTitle}>Next gigs.</h2>
          <Link href="/events" className={styles.secLink}>
            Full calendar ↗
          </Link>
        </Reveal>
        <div className={styles.eventsLayout}>
          <Stagger className={styles.eventList} gap={0.07}>
            {up.map((e) => (
              <StaggerItem key={e.n} variant="up">
                <Link href={`/events/${eventSlug(e)}`} className={styles.eventRow}>
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
              </StaggerItem>
            ))}
            <StaggerItem variant="up">
              <Link href="/archive" className={styles.pastLink}>
                <span>Past events</span>
                <span>Archive ↗</span>
              </Link>
            </StaggerItem>
          </Stagger>
          {feature && (
            <Reveal as="figure" variant="mask" duration={1} className={styles.eventFeature}>
              <span className={styles.eventFeatureFrame}>
                <img
                  src={feature.poster || '/assets/hero-booth.jpg'}
                  alt={`Poster — ${feature.title}`}
                  loading="lazy"
                />
                <PosterFX tone="dark" />
              </span>
              <figcaption className={styles.eventFeatureCap}>
                <span>N°{feature.n}</span>
                <span>{dowDate(feature)}</span>
              </figcaption>
            </Reveal>
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
            <SignatureTitle as="h2" className={styles.manifestoStatement} stagger={0.09} parallax={28}>
              <span>A room. A system.</span>
              <span>A crowd that came</span>
              <span>
                to <em>listen.</em>
              </span>
            </SignatureTitle>
            <Reveal variant="up" delay={0.2}>
              <p className={styles.manifestoBody}>
                Hertz was born in Bologna in 2023, out of one conviction: the night was turning
                into something to watch, and less something to live. So we put the attention back
                on what actually matters — the selection, the dancefloor, and the energy shared
                between clubbers. A floor where the record does the talking, where a good one can
                roll for nine minutes before anyone checks the time. The rest is just volume.
              </p>
              <Link href="/about" className={`${styles.btn} ${styles.btnGhost} ${styles.manifestoLink}`}>
                Read the manifesto ↗
              </Link>
            </Reveal>
          </div>
          <MaskImage direction="left" duration={1.1} className={styles.manifestoPhoto}>
            <img src="/assets/crowd-floor.jpg" alt="People on the Hertz dancefloor" loading="lazy" />
          </MaskImage>
        </div>
      </Section>

      {/* ═══ 04 · ARTISTS (cold-blue) ═══ */}
      <Section surface="cold-blue" space="lg" id="artists">
        <div className={styles.artistsHead}>
          <div>
            <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-sm)' }}>
              03 / Residents
            </p>
            <SignatureTitle as="h2" className={styles.artistsTitle} stagger={0.09}>
              <span>The</span>
              <span>Family.</span>
            </SignatureTitle>
          </div>
          <p className={styles.artistsHint}>Select an artist →</p>
        </div>
        <Stagger className={styles.artistList} gap={0.08}>
          {ROSTER.map((slug, i) => {
            const a = ARTISTS[slug]
            return (
              <StaggerItem key={slug} variant="left">
                <Link href={`/artists/${slug}`} className={styles.artistRow}>
                  <span className={styles.aNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.aName}>{a.name}</span>
                  <span className={styles.aRole}>{a.role}</span>
                  <span className={styles.aArrow} aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Section>

      {/* ═══ 05 · MUSIC (paper) ═══ */}
      <Section surface="paper" space="lg" id="music">
        <Reveal variant="up" className={styles.secHead}>
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
        </Reveal>
        <Stagger className={styles.mixList} gap={0.06}>
          {mixes.map((m, i) => (
            <StaggerItem key={m.url} variant="up">
              <a href={m.url} target="_blank" rel="noreferrer" className={styles.mixRow}>
                <span className={styles.mixNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.mixTitle}>{m.t}</span>
                <span className={styles.mixArtist}>{m.artist}</span>
                <span className={styles.mixTag}>{m.tag ?? 'Mix'}</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ═══ 06 · MEDIA (white) ═══ */}
      <Section surface="white" space="lg" id="media">
        <Reveal variant="up" className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>05 / Media</span>
          <h2 className={styles.secTitle}>Reading the signal.</h2>
          <Link href="/media" className={styles.secLink}>
            All media ↗
          </Link>
        </Reveal>
        <Stagger className={styles.mediaGrid} gap={0.1}>
          {ARTICLES.map((a, i) => (
            <StaggerItem key={a.slug} variant="blur" className={i === 0 ? styles.mediaLead : undefined}>
              <Link href={`/media/${a.slug}`} className={styles.mediaCard}>
                <div className={styles.mcImg}>
                  <img src={a.heroImage} alt={a.heroImageAlt} loading="lazy" />
                </div>
                <span className={styles.mcRubric}>{a.rubric}</span>
                <span className={styles.mcTitle}>{a.title}</span>
                <span className={styles.mcMeta}>
                  {a.author} · {a.readingTimeMinutes} min
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ═══ 07 · ARCHIVE (white) ═══ */}
      <Section surface="white" space="lg" id="archive">
        <div className={styles.archiveHead}>
          <div>
            <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-sm)' }}>
              06 / Archive
            </p>
            <SignatureTitle as="h2" className={styles.archiveTitle} stagger={0.1}>
              <span>Nights on</span>
              <span>record.</span>
            </SignatureTitle>
          </div>
          <p className={styles.archiveIntro}>
            A moving archive of faces, rooms and fragments from the Hertz floor —
            Kindergarten and beyond.
          </p>
        </div>
        <Stagger className={styles.archiveStrip} gap={0.07}>
          {ARCHIVE_PHOTOS.map((src, i) => (
            <StaggerItem key={src} variant="right">
              <figure className={styles.archiveCard}>
                <img src={src} alt="Hertz night — Kindergarten archive" loading="lazy" />
                <figcaption>
                  <span>Kindergarten</span>
                  <span>
                    {String(i + 1).padStart(2, '0')} / {ARCHIVE_PHOTOS.length}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal variant="up">
          <Link
            href="/archive"
            className={`${styles.btn} ${styles.btnGhost}`}
            style={{ marginTop: 'var(--hz-space-lg)', display: 'inline-flex' }}
          >
            Open archive ↗
          </Link>
        </Reveal>
      </Section>

      {/* ═══ 08 · SHOP (paper) ═══ */}
      <Section surface="paper" space="lg" id="shop">
        <Reveal variant="up" className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>07 / Shop</span>
          <h2 className={styles.secTitle}>Hertz uniform.</h2>
          <Link href="/shop" className={styles.secLink}>
            Visit shop ↗
          </Link>
        </Reveal>
        <Reveal variant="up" delay={0.1} className={styles.shopCard}>
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
        </Reveal>
        <div style={{ marginTop: 'var(--hz-space-xl)' }}>
          <Reveal variant="up" delay={0.15}>
            <MerchWaitlist />
          </Reveal>
        </div>
      </Section>

      {/* ═══ 08b · IN COLLABORATION WITH (white) ═══ */}
      <Section surface="white" space="md" id="partners">
        <Reveal variant="up">
          <Partners />
        </Reveal>
      </Section>

      {/* ═══ 09 · BOOKING (signal) ═══ */}
      <Section surface="signal" space="lg" id="booking">
        <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-md)' }}>
          08 / Connect
        </p>
        <SignatureTitle as="h2" className={styles.bookTitle} stagger={0.09}>
          <span>Bring Hertz to</span>
          <span>your room.</span>
        </SignatureTitle>
        <Stagger className={styles.bookActions} gap={0.08}>
          <StaggerItem variant="up">
            <Link href="/bookings" className={styles.bookRow}>
              <span>Artist booking</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </StaggerItem>
          <StaggerItem variant="up">
            <Link href="/bookings" className={styles.bookRow}>
              <span>Event collaboration</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </StaggerItem>
          <StaggerItem variant="up">
            <Link href="/bookings" className={styles.bookRow}>
              <span>Press &amp; partnerships</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </StaggerItem>
        </Stagger>
        <Reveal variant="up" delay={0.1}>
          <a href="mailto:hertzbologna@gmail.com" className={styles.bookEmail}>
            hertzbologna@gmail.com ↗
          </a>
        </Reveal>
      </Section>
    </main>
  )
}
