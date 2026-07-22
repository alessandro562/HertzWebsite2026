import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import ImageReveal from '@/motion/ImageReveal'
import PrintInterruption from '@/motion/PrintInterruption'
import ArchiveExplorer from '@/components/archive/ArchiveExplorer'
import { archive, eventYear, eventSlug, shortDate, dowDate } from '@/content/events'
import { galleryFor } from '@/content/galleries'
import { ARTISTS } from '@/content/artists'
import styles from './archive.module.css'

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Le notti passate di Hertz — venue, line-up e servizi fotografici reali. Kindergarten, Numa, Cassero e altri.',
  alternates: { canonical: '/archive' },
}

export default function ArchivePage() {
  const past = archive()
  const years = [...new Set(past.map(eventYear))]
  const venues = new Set(past.map((e) => e.venue))
  const withGalleries = past.filter((e) => galleryFor(e.n).length > 0)
  const totalPhotos = withGalleries.reduce((sum, e) => sum + galleryFor(e.n).length, 0)
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

  /* featured spread: la sessione con più fotografie reali disponibili */
  const featured = [...withGalleries].sort((a, b) => galleryFor(b.n).length - galleryFor(a.n).length)[0]
  const featuredPhotos = featured ? galleryFor(featured.n) : []
  const featuredResidents = featured ? featured.lineup.map((s) => ARTISTS[s]?.name).filter(Boolean) : []

  return (
    <main id="main">
      <Section surface="white" space="lg">
        <PageHeader
          index="06"
          kicker="Archive"
          title={
            <>
              Wicked
              <br />
              nights.
            </>
          }
          intro={
            <p>
              A moving record of faces, rooms and fragments — Kindergarten, Numa, Cassero and more.
              Photography stays raw; the interface supplies the rhythm.
            </p>
          }
          aside={
            <dl className={`${styles.stats} hz-mono`}>
              <div>
                <dt>Nights</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Years</dt>
                <dd>{years.length}</dd>
              </div>
              <div>
                <dt>Venues</dt>
                <dd>{venues.size}</dd>
              </div>
              <div>
                <dt>Frames</dt>
                <dd>{totalPhotos}</dd>
              </div>
            </dl>
          }
        />
      </Section>

      {/* ── featured spread: WICKED NIGHTS — la sessione con più fotografia reale ── */}
      {featured && featuredPhotos.length > 0 && (
        <Section surface="paper" space="lg">
          <div className={styles.featured}>
            <PrintInterruption
              image={featuredPhotos[0]}
              alt={`${featured.title} — archive`}
              aspectRatio="4 / 3"
              fragment={featuredPhotos[1] ? { src: featuredPhotos[1], alt: `${featured.title} — frame 2` } : undefined}
              className={styles.featuredSpread}
            />
            <div className={styles.featuredText}>
              <span className={`${styles.featuredYear} hz-mono`}>{eventYear(featured)}</span>
              <span className={`${styles.featuredN} hz-mono`}>N°{featured.n}</span>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredVenue}>
                {featured.venue} · {featured.city}
              </p>
              {featuredResidents.length > 0 && (
                <p className={styles.featuredLineup}>{featuredResidents.join(' · ')}</p>
              )}
              <Link href={`/events/${eventSlug(featured)}`} className={styles.featuredLink}>
                View the night ↗
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* ── photo galleries (reali) ── */}
      {withGalleries.length > 0 && (
        <Section surface="white" space="lg">
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
                    <span className={`${styles.galCount} hz-mono`}>{photos.length} frames ↗</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── sessions: ledger denso, filtro anno + DISORDER ── */}
      <Section surface="paper" space="lg">
        <SectionLabel kicker="Sessions" title="Every night." />
        <ArchiveExplorer items={items} years={years} />
      </Section>
    </main>
  )
}
