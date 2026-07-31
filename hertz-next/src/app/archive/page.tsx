/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import Arrow from '@/components/ui/Arrow'
import GlitchFX from '@/components/ui/GlitchFX'
import ImageReveal from '@/motion/ImageReveal'
import PrintInterruption from '@/motion/PrintInterruption'
import ArchiveExplorer from '@/components/archive/ArchiveExplorer'
import { archive, eventYear, eventSlug, shortDate, dowDate } from '@/content/events'
import { galleryFor } from '@/content/galleries'
import { ARTISTS } from '@/content/artists'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, mailto } from '@/lib/site'
import { DEFAULT_OG_IMAGE, ORG_ID, WEBSITE_ID, breadcrumbNode } from '@/lib/seo'
import styles from './archive.module.css'

export const metadata: Metadata = {
  title: 'Press Kit & Photo Archive',
  description:
    'Hertz press kit and hi-res club photography: logo, party photos and materials for promoters, venues and journalists. Free to use with credit.',
  keywords: ['press kit', 'archivio foto', 'clubbing photography', 'party Bologna', 'dj', 'collettivo'],
  alternates: { canonical: '/archive' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_GB',
    url: `${SITE.url}/archive`,
    title: 'Press Kit & Photo Archive · Hertz Clubbing Collective',
    description:
      'Hertz press kit and hi-res club photography: logo, party photos and materials for promoters, venues and journalists.',
    images: [DEFAULT_OG_IMAGE],
  },
}

/* Press kit — inventario reale (archive.html). Lo ZIP non è ancora nel repo:
   il download è sostituito da una richiesta via email finché il file esiste. */
const PRESS_KIT = [
  'Logos: AI · SVG · PNG, light & dark',
  'Hi-res live photography',
  'Artist bios + booking contacts',
  'Tech rider + stage plot',
  'Brand guide: colours, type, usage',
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

  /* La galleria dichiarata come ImageGallery: 36 frame reali che oggi Google
     Immagini non associa a nulla. Con il nodo diventano risultati con licenza
     e attribuzione, che è esattamente ciò che il press kit promette. */
  const gallery = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Hertz photo archive',
    description:
      'Hi-res photography from Hertz club nights in Bologna and across Italy. Free to use with credit.',
    url: `${SITE.url}/archive`,
    isPartOf: { '@id': WEBSITE_ID },
    associatedMedia: PHOTO_ARCHIVE.map((src) => ({
      '@type': 'ImageObject',
      contentUrl: `${SITE.url}${src}`,
      creditText: SITE.pressCredit,
      copyrightNotice: `© ${SITE.name}`,
      creator: { '@id': ORG_ID },
      acquireLicensePage: `${SITE.url}/archive`,
    })),
  }

  return (
    <main id="main">
      <JsonLd data={gallery} />
      <JsonLd data={breadcrumbNode([{ name: 'Press & Archive', path: '/archive' }])} />

      {/* ── header (white) — identità reale del /archive live: press ── */}
      <Section surface="white" space="lg">
        <PageHeader
          kicker="Press kit & photo archive"
          title="For the press."
          intro={
            <p>
              Logos, hi-res photography and everything a promoter or journalist needs to run Hertz.
              Grab the full kit, or pull individual frames below.
            </p>
          }
        />
      </Section>

      {/* ── press kit (paper) ── */}
      <Section surface="paper" space="lg" id="press-kit">
        <SectionLabel kicker="The press kit" title="Everything in one folder." />
        <div className={styles.pressKit}>
          <div className={styles.pkMain}>
            <p className={styles.pkLede}>
              Hi-res photography, vector logos, artist bios and the tech rider, packaged for press,
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
                href={mailto('Press kit · Hertz', 'Hi Hertz, could you send me the press kit?')}
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
                {/* sorgente 5444x4032 resa a 220px: lasciamo scegliere la
                    variante all'ottimizzatore */}
                <Image
                  src="/assets/hertz-logo-official.png"
                  alt="Hertz official logo"
                  width={440}
                  height={326}
                  sizes="220px"
                />
              </div>
              <div className={styles.pkSpecs}>
                <div>
                  <div className={styles.pkK}>Format</div>
                  <div className={styles.pkV}>.ZIP</div>
                </div>
                <div>
                  <div className={styles.pkK}>Usage</div>
                  <div className={styles.pkV}>Credit {SITE.pressCredit}</div>
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
          kicker="Photo archive · free for press"
          title="Shoot the room."
        />
        <div className={styles.photoGrid}>
          {PHOTO_ARCHIVE.map((src, i) => (
            /* href resta l'originale hi-res (è un download stampa); solo la
               miniatura passa dall'ottimizzatore, prima erano 36 JPEG da
               1280x1600 renderizzati in una griglia di quadratini. */
            <a key={src + i} className={`${styles.pressShot} hz-glitch`} href={src} download>
              <Image
                src={src}
                alt={`Hertz live, archive frame ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
              <GlitchFX />
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
        <SectionLabel kicker="Archive" title="Rewind." />
        {featured && featuredPhotos.length > 0 && (
          <div className={styles.featured}>
            <PrintInterruption
              image={featuredPhotos[0]}
              alt={`${featured.title}, archive`}
              aspectRatio="4 / 3"
              fragment={
                featuredPhotos[1] ? { src: featuredPhotos[1], alt: `${featured.title}, frame 2` } : undefined
              }
              className={styles.featuredSpread}
            />
            <div className={styles.featuredText}>
              <span className={`${styles.featuredYear} hz-mono`}>{eventYear(featured)}</span>
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
          <SectionLabel kicker="Photo galleries" title="From the dancefloor." />
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
                    <span className="hz-mono">{shortDate(e)}</span>
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
