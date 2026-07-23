/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import Arrow from '@/components/ui/Arrow'
import ImageReveal from '@/motion/ImageReveal'
import PrintInterruption from '@/motion/PrintInterruption'
import ArchiveExplorer from '@/components/archive/ArchiveExplorer'
import { archive, eventYear, eventSlug, shortDate, dowDate } from '@/content/events'
import { galleryFor } from '@/content/galleries'
import { ARTISTS } from '@/content/artists'
import { SITE, mailto } from '@/lib/site'
import styles from './archive.module.css'

export const metadata: Metadata = {
  title: 'Press & Archive',
  description:
    'Press kit e fotografia in alta risoluzione di Hertz: logo, foto degli eventi e materiali per promoter, locali e giornalisti. Uso libero con credito @hertz.cc.',
  alternates: { canonical: '/archive' },
  openGraph: { title: 'Press & Archive — Hertz Clubbing Collective' },
}

/* Press kit — inventario reale (archive.html). Lo ZIP non è ancora nel repo:
   il download è sostituito da una richiesta via email finché il file esiste. */
const PRESS_KIT = [
  'Logos — AI · SVG · PNG, light & dark',
  'Hi-res live photography',
  'Artist bios + booking contacts',
  'Tech rider + stage plot',
  'Brand guide — colours, type, usage',
]

/* Photo archive — 36 frame reali scaricabili (tutti presenti in public/). */
const PHOTO_ARCHIVE = [
  '/uploads/24.04_Hertz-95.jpg',
  '/uploads/24.04_Hertz-17.jpg',
  '/uploads/24.04_Hertz-58.jpg',
  '/uploads/24.04_Hertz-62.jpg',
  '/uploads/24.04_Hertz-73.jpg',
  '/uploads/24.04_Hertz-86.jpg',
  '/uploads/24.04_Hertz-129.jpg',
  '/uploads/24.04_Hertz-18.jpg',
  '/uploads/24.04_Hertz-24.jpg',
  '/uploads/26.12_Hertz-86.jpg',
  '/uploads/26.12_Hertz-28.jpg',
  '/uploads/26.12_Hertz-55.jpg',
  '/assets/archivio-web/26.12_Hertz-106.jpg',
  '/assets/archivio-web/26.12_Hertz-109.jpg',
  '/assets/archivio-web/26.12_Hertz-113.jpg',
  '/assets/archivio-web/26.12_Hertz-181.jpg',
  '/assets/archivio-web/26.12_Hertz-184.jpg',
  '/assets/archivio-web/26.12_Hertz-71.jpg',
  '/assets/archivio-web/26.12_Hertz-74.jpg',
  '/assets/archivio-web/26.12_Hertz-82.jpg',
  '/assets/archivio-web/26.12_Hertz-86.jpg',
  '/assets/archivio-web/26.12_Hertz-92.jpg',
  '/assets/archivio-web/26.12_Hertz-95.jpg',
  '/assets/archivio-web/27.02_Hertz-105.jpg',
  '/assets/archivio-web/27.02_Hertz-108.jpg',
  '/assets/archivio-web/27.02_Hertz-141.jpg',
  '/assets/archivio-web/27.02_Hertz-144.jpg',
  '/assets/archivio-web/27.02_Hertz-173.jpg',
  '/assets/archivio-web/27.02_Hertz-188.jpg',
  '/assets/archivio-web/27.02_Hertz-191.jpg',
  '/assets/archivio-web/27.02_Hertz-38.jpg',
  '/assets/archivio-web/27.02_Hertz-41.jpg',
  '/assets/archivio-web/27.02_Hertz-49.jpg',
  '/assets/archivio-web/27.02_Hertz-52.jpg',
  '/assets/archivio-web/27.02_Hertz-55.jpg',
  '/assets/archivio-web/27.02_Hertz-74.jpg',
]

export default function ArchivePage() {
  const past = archive()
  const years = [...new Set(past.map(eventYear))]
  const venues = new Set(past.map((e) => e.venue))
  const withGalleries = past.filter((e) => galleryFor(e.n).length > 0)
  const items = past.map((e) => ({
    n: e.n,
    title: e.title,
    venue: e.venue,
    city: e.city,
    year: eventYear(e),
    slug: eventSlug(e),
    date: dowDate(e),
    lineup: e.lineup.map((s) => ARTISTS[s]?.name).filter(Boolean),
    hasGallery: galleryFor(e.n).length > 0,
  }))

  const featured = [...withGalleries].sort((a, b) => galleryFor(b.n).length - galleryFor(a.n).length)[0]
  const featuredPhotos = featured ? galleryFor(featured.n) : []
  const featuredResidents = featured ? featured.lineup.map((s) => ARTISTS[s]?.name).filter(Boolean) : []

  return (
    <main id="main">
      {/* ── header (white) — identità reale del /archive live: press ── */}
      <Section surface="white" space="lg">
        <PageHeader
          index="06"
          kicker="Press kit & photo archive"
          title="For the press."
          intro={
            <p>
              Logos, hi-res photography and everything a promoter or journalist needs to run Hertz.
              Grab the full kit, or pull individual frames below.
            </p>
          }
          aside={
            <dl className={`${styles.stats} hz-mono`}>
              <div>
                <dt>Frames</dt>
                <dd>{PHOTO_ARCHIVE.length}</dd>
              </div>
              <div>
                <dt>Nights</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Venues</dt>
                <dd>{venues.size}</dd>
              </div>
            </dl>
          }
        />
      </Section>

      {/* ── press kit (paper) ── */}
      <Section surface="paper" space="lg" id="press-kit">
        <SectionLabel index="A" kicker="The press kit" title="Everything in one folder." />
        <div className={styles.pressKit}>
          <div className={styles.pkMain}>
            <p className={styles.pkLede}>
              Hi-res photography, vector logos, artist bios and the tech rider — packaged for press,
              promoters and venues. One request, ready to use.
            </p>
            <ul className={styles.pkList}>
              {PRESS_KIT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.pkActions}>
              <a
                className={styles.pkDl}
                href={mailto('Press kit — Hertz', 'Hi Hertz, could you send me the press kit?')}
              >
                Request the press kit <span aria-hidden="true">↓</span>
              </a>
              <a className={styles.pkMail} href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </div>
          </div>
          <div className={styles.pkSide}>
            <div className={styles.pkCard}>
              <div className={styles.pkCardTop}>
                <span>HERTZ / PRESS</span>
                <span>V1</span>
              </div>
              <div className={styles.pkLogo}>
                <img src="/assets/hertz-logo-official.png" alt="Hertz official logo" />
              </div>
              <div className={styles.pkSpecs}>
                <div>
                  <div className={styles.pkK}>Format</div>
                  <div className={styles.pkV}>.ZIP</div>
                </div>
                <div>
                  <div className={styles.pkK}>Usage</div>
                  <div className={styles.pkV}>Credit ©©</div>
                </div>
                <div>
                  <div className={styles.pkK}>Updated</div>
                  <div className={styles.pkV}>2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── photo archive (ink) — frame scaricabili ── */}
      <Section surface="ink" space="lg" id="photo-archive">
        <SectionLabel
          index="B"
          kicker="Photo archive · free for press"
          title="Shoot the room."
        />
        <div className={styles.photoGrid}>
          {PHOTO_ARCHIVE.map((src, i) => (
            <a key={src + i} className={styles.pressShot} href={src} download>
              <span className={`${styles.pressIx} hz-mono`}>{String(i + 1).padStart(2, '0')}</span>
              <img src={src} alt={`Hertz live — archive frame ${i + 1}`} loading="lazy" />
              <span className={`${styles.pressDl} hz-mono`}>↓ JPG</span>
            </a>
          ))}
        </div>
        <p className={`${styles.pressHint} hz-mono`}>
          Click any frame to download · Credit {SITE.pressCredit} · JPG · hi-res
        </p>
      </Section>

      {/* ── nights on record (past events, dati reali) ── */}
      <Section surface="white" space="lg" id="nights">
        <SectionLabel index="C" kicker="Archive" title="Rewind." />
        {featured && featuredPhotos.length > 0 && (
          <div className={styles.featured}>
            <PrintInterruption
              image={featuredPhotos[0]}
              alt={`${featured.title} — archive`}
              aspectRatio="4 / 3"
              fragment={
                featuredPhotos[1] ? { src: featuredPhotos[1], alt: `${featured.title} — frame 2` } : undefined
              }
              className={styles.featuredSpread}
            />
            <div className={styles.featuredText}>
              <span className={`${styles.featuredYear} hz-mono`}>{eventYear(featured)}</span>
              <span className={`${styles.featuredN} hz-mono`}>N°{featured.n}</span>
              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              <p className={styles.featuredVenue}>
                {featured.venue} · {featured.city}
              </p>
              {featuredResidents.length > 0 && (
                <p className={styles.featuredLineup}>{featuredResidents.join(' · ')}</p>
              )}
              <Link href={`/events/${eventSlug(featured)}`} className={styles.featuredLink}>
                View the night <Arrow />
              </Link>
            </div>
          </div>
        )}
      </Section>

      {withGalleries.length > 0 && (
        <Section surface="paper" space="lg">
          <SectionLabel kicker="Photo galleries" title="From the floor." />
          <div className={styles.galGrid}>
            {withGalleries.map((e) => {
              const photos = galleryFor(e.n)
              return (
                <Link key={e.n} href={`/events/${eventSlug(e)}#gallery`} className={styles.galCard}>
                  <div className={styles.galThumbs}>
                    {photos.slice(0, 3).map((src, i) => (
                      <ImageReveal
                        key={src}
                        variant={i === 0 ? 'print' : 'horizontal'}
                        duration="reveal"
                        delay={i * 0.06}
                        className={styles.thumb}
                      >
                        <ImageFrame src={src} alt={`${e.title} archive`} ratio="1 / 1" />
                      </ImageReveal>
                    ))}
                  </div>
                  <div className={styles.galMeta}>
                    <span className="hz-mono">
                      N°{e.n} · {shortDate(e)}
                    </span>
                    <span className={styles.galTitle}>{e.title}</span>
                    <span className={`${styles.galCount} hz-mono`}>{photos.length} frames <Arrow /></span>
                  </div>
                </Link>
              )
            })}
          </div>
        </Section>
      )}

      <Section surface="white" space="lg">
        <SectionLabel kicker="Sessions" title="Every night." />
        <ArchiveExplorer items={items} years={years} />
      </Section>
    </main>
  )
}
