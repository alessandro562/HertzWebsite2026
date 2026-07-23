/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import HomeHero from '@/components/home/HomeHero'
import HeroKinetic from '@/components/home/HeroKinetic'
import KineticBand from '@/components/home/KineticBand'
import BrandIdentity from '@/components/home/BrandIdentity'
import Partners from '@/components/home/Partners'
import Reveal, { Stagger, StaggerItem } from '@/motion/Reveal'
import SignatureTitle from '@/motion/SignatureTitle'
import MaskImage from '@/motion/MaskImage'
import { upcoming, dowDate, eventSlug, type ResidentSlug } from '@/content/events'
import { ARTISTS } from '@/content/artists'
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
  const restGigs = up.slice(1)

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
      {heroClassic ? <HomeHero next={nextEvent} /> : <HeroKinetic />}

      {/* ═══ 02 · INTRODUCTION (signal) ═══ */}
      <Section surface="signal" space="lg" id="intro">
        <div className={styles.introGrid}>
          <div className={styles.introText}>
            <Reveal as="p" variant="mask" duration={0.9} className={styles.introLead}>
              A clubbing collective from Bologna. We put the record and the dancefloor first.
            </Reveal>
            <Reveal as="p" variant="up" delay={0.12} className={styles.introSupport}>
              Since 2023 we&rsquo;ve booked the nights we&rsquo;d want to be at: minimal &amp;
              deep tech, selection over spectacle, from clubbers, for clubbers.
            </Reveal>
          </div>
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
        primary={['CLUBBING', 'IDENTITY']}
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

      {/* ═══ 03 · EVENTS (white) — indice editoriale, nessuna locandina ═══ */}
      <Section surface="white" space="lg" id="events">
        <Reveal variant="up" className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>01 / Events</span>
          <h2 className={styles.secTitle}>Next gigs.</h2>
          <Link href="/events" className={styles.secLink}>
            Full calendar <Arrow />
          </Link>
        </Reveal>

        {next && (
          <Reveal variant="up">
            <Link href={`/events/${eventSlug(next)}`} className={`${styles.gigLead} hz-rowfx`}>
              <span className={styles.gigLeadHead}>
                <span className={`${styles.gigLeadKicker} hz-mono`}>Next event · N°{next.n}</span>
                <span
                  className={`${styles.status} ${next.onSale ? styles.statusOn : styles.statusSoon}`}
                >
                  {next.onSale ? 'On sale' : 'Soon'}
                </span>
              </span>
              <span className={`${styles.gigLeadDate} hz-mono`}>{dowDate(next)}</span>
              <span className={styles.gigLeadTitle}>{next.title}</span>
              <span className={styles.gigLeadFoot}>
                <span className={`${styles.gigLeadVenue} hz-mono`}>
                  {next.venue} · {next.city}
                </span>
                <span className={`${styles.gigLeadCta} hz-mono hz-fx-arrow`}>
                  View event <Arrow />
                </span>
              </span>
            </Link>
          </Reveal>
        )}

        <Stagger className={styles.eventList} gap={0.07}>
          {restGigs.map((e) => (
            <StaggerItem key={e.n} variant="up">
              <Link href={`/events/${eventSlug(e)}`} className={`${styles.eventRow} hz-rowfx`}>
                <span className={`${styles.eRowDate} hz-mono`}>{dowDate(e)}</span>
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
                  <span className={`${styles.eRowArrow} hz-fx-arrow`} aria-hidden="true">
                    <Arrow />
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
          <StaggerItem variant="up">
            <Link href="/archive" className={styles.pastLink}>
              <span>Past events</span>
              <span>Archive <Arrow /></span>
            </Link>
          </StaggerItem>
        </Stagger>
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
                on what actually matters: the selection, the dancefloor and the energy shared
                between clubbers. A floor where the record does the talking, where a good one can
                roll for nine minutes before anyone checks the time. The rest is just volume.
              </p>
              <Link href="/about" className={`${styles.btn} ${styles.btnGhost} ${styles.manifestoLink}`}>
                Read the manifesto <Arrow />
              </Link>
            </Reveal>
          </div>
          <MaskImage direction="left" duration={1.1} className={`${styles.manifestoPhoto} hz-glitch`}>
            <img src="/assets/crowd-floor.jpg" alt="People on the Hertz dancefloor" loading="lazy" />
            <GlitchFX />
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
              <span>collective.</span>
            </SignatureTitle>
          </div>
          <p className={styles.artistsHint}>Select an artist →</p>
        </div>
        <Stagger className={styles.artistList} gap={0.08}>
          {ROSTER.map((slug, i) => {
            const a = ARTISTS[slug]
            return (
              <StaggerItem key={slug} variant="left">
                <Link href={`/artists/${slug}`} className={`${styles.artistRow} hz-rowfx`}>
                  <span className={styles.aNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.aName}>{a.name}</span>
                  <span className={styles.aRole}>{a.role}</span>
                  <span className={`${styles.aArrow} hz-fx-arrow`} aria-hidden="true">
                    <Arrow />
                  </span>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Section>

      {/* ═══ 05 · ARCHIVE (white) ═══ */}
      <Section surface="white" space="lg" id="archive">
        <div className={styles.archiveHead}>
          <div>
            <p className="hz-mono" style={{ color: 'var(--hz-ink-mute)', marginBottom: 'var(--hz-space-sm)' }}>
              05 / Archive
            </p>
            <SignatureTitle as="h2" className={styles.archiveTitle} stagger={0.1}>
              <span>Rewind.</span>
            </SignatureTitle>
          </div>
          <p className={styles.archiveIntro}>
            A moving archive of faces, rooms and fragments from the Hertz floor:
            Kindergarten and beyond.
          </p>
        </div>
        <Stagger className={styles.archiveStrip} gap={0.07}>
          {ARCHIVE_PHOTOS.map((src, i) => (
            <StaggerItem key={src} variant="right">
              <figure className={`${styles.archiveCard} hz-cardfx hz-glitch`}>
                <img src={src} alt="Hertz night, Kindergarten archive" loading="lazy" />
                <GlitchFX />
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
            Open archive <Arrow />
          </Link>
        </Reveal>
      </Section>

      {/* ═══ 06 · MORE (paper) — clubber apparel + clubbing culture: link alle pagine ═══ */}
      <Section surface="paper" space="md" id="more">
        <Stagger className={styles.moreGrid} gap={0.08}>
          <StaggerItem variant="up">
            <Link href="/shop" className={`${styles.moreCard} hz-cardfx`}>
              <span className={`${styles.moreKicker} hz-mono`}>Shop</span>
              <span className={styles.moreTitle}>Clubber apparel.</span>
              <span className={styles.moreMeta}>
                Small numbered drops, made for the floor{' '}
                <span className="hz-fx-arrow">
                  <Arrow />
                </span>
              </span>
            </Link>
          </StaggerItem>
          <StaggerItem variant="up">
            <Link href="/media" className={`${styles.moreCard} hz-cardfx`}>
              <span className={`${styles.moreKicker} hz-mono`}>Media</span>
              <span className={styles.moreTitle}>Clubbing culture.</span>
              <span className={styles.moreMeta}>
                Reportage and reading, written from the floor{' '}
                <span className="hz-fx-arrow">
                  <Arrow />
                </span>
              </span>
            </Link>
          </StaggerItem>
        </Stagger>
      </Section>

      {/* ═══ 06b · IN COLLABORATION WITH (white) ═══ */}
      <Section surface="white" space="md" id="partners">
        <Reveal variant="up">
          <Partners />
        </Reveal>
      </Section>

    </main>
  )
}
