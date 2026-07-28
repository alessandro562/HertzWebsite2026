/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import HomeHero from '@/components/home/HomeHero'
import HeroKinetic from '@/components/home/HeroKinetic'
import FeaturedEvent from '@/components/events/FeaturedEvent'
import EventModule from '@/components/events/EventModule'
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
      {heroClassic ? <HomeHero next={nextEvent} /> : <HeroKinetic next={nextEvent} />}

      {/* ═══ 02 · INTRODUCTION (signal) ═══ */}
      <Section surface="signal" space="lg" id="intro">
        <div className={styles.introGrid}>
          <div className={styles.introText}>
            <Reveal as="p" variant="mask" duration={0.9} className={styles.introLead}>
              Hertz is a clubbing collective from Bologna.
            </Reveal>
            <Reveal as="p" variant="up" delay={0.12} className={styles.introSupport}>
              Since 2023 we&rsquo;ve worked to put music selection back at the center of the night,
              and to bring back the idea of real clubbing: the kind made of moments you actually
              remember, the ones only a real dancefloor can give. Minimal and deep tech, done
              properly, from clubbers for clubbers.
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

      {/* ═══ EVENTS (white) — Next gigs, indice editoriale ═══ */}
      <Section surface="white" space="lg" id="events">
        <Reveal variant="up" className={styles.secHead}>
          <span className={`${styles.secKicker} hz-mono`}>Events</span>
          <h2 className={styles.secTitle}>Next gigs.</h2>
          <Link href="/events" className={styles.secLink}>
            Full calendar <Arrow />
          </Link>
        </Reveal>

        {next && (
          <Reveal variant="up" className={styles.featuredWrap}>
            <FeaturedEvent event={next} />
          </Reveal>
        )}

        {restGigs.length > 0 && (
          <Stagger className={styles.eventList} gap={0.07}>
            {restGigs.map((e) => (
              <StaggerItem key={e.n} variant="up">
                <EventModule event={e} />
              </StaggerItem>
            ))}
            <StaggerItem variant="up">
              <Link href="/archive" className={styles.pastLink}>
                <span>Past events</span>
                <span>Archive <Arrow /></span>
              </Link>
            </StaggerItem>
          </Stagger>
        )}
      </Section>

      {/* ═══ ORDER / DISORDER — banda cinetica · SIGNAL (ink, edge-to-edge) ═══ */}
      <KineticBand
        primary={['CLUBBING', 'IDENTITY']}
        secondary={['44.49° N', '11.34° E', 'BOLOGNA', 'MINIMAL', 'DEEP TECH']}
        labelLeft="SIGNAL"
        labelRight="FROM CLUBBERS · FOR CLUBBERS"
      />

      {/* ═══ VISUAL IDENTITY (paper) ═══ */}
      <Section surface="paper" space="lg" id="identity">
        <Reveal variant="up">
          <BrandIdentity />
        </Reveal>
      </Section>

      {/* ═══ MANIFESTO (ink — unico dark) ═══ */}
      <Section surface="ink" space="lg" id="manifesto">
        <div className={styles.manifestoGrid}>
          <div>
            <SignatureTitle as="h2" className={styles.manifestoStatement} stagger={0.09} parallax={28}>
              <span>A room. A system.</span>
              <span>A crowd that came</span>
              <span>
                to <em>dance.</em>
              </span>
            </SignatureTitle>
            <Reveal variant="up" delay={0.2}>
              <p className={styles.manifestoBody}>
                Hertz started in Bologna in 2023, when going out had started to feel more about
                being seen than being there. We wanted the opposite: nights built around the music,
                the sound system and the people on the floor. Real clubbing isn&rsquo;t a show you
                watch, it&rsquo;s something you live, the kind of night that only happens when the
                right room, the right sound and the right crowd come together. That&rsquo;s what we
                set out to bring back.
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
              Residents
            </p>
            <SignatureTitle as="h2" className={styles.artistsTitle} stagger={0.09}>
              <span>The</span>
              <span>collective.</span>
            </SignatureTitle>
          </div>
          <p className={styles.artistsHint}>Select an artist →</p>
        </div>
        <Stagger className={styles.artistList} gap={0.08}>
          {ROSTER.map((slug) => {
            const a = ARTISTS[slug]
            return (
              <StaggerItem key={slug} variant="left">
                <Link href={`/artists/${slug}`} className={`${styles.artistRow} hz-rowfx`}>
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
              Archive
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
          {ARCHIVE_PHOTOS.map((src) => (
            <StaggerItem key={src} variant="right">
              <figure className={`${styles.archiveCard} hz-cardfx hz-glitch`}>
                <img src={src} alt="Hertz night, Kindergarten archive" loading="lazy" />
                <GlitchFX />
                <figcaption>
                  <span>Kindergarten</span>
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
