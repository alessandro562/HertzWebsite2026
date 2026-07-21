import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import EventRow from '@/components/events/EventRow'
import { archive, eventYear, eventSlug, shortDate } from '@/content/events'
import { galleryFor } from '@/content/galleries'
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
  const byYear = years.map((y) => ({ y, events: past.filter((e) => eventYear(e) === y) }))
  const withGalleries = past.filter((e) => galleryFor(e.n).length > 0)

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
            <nav className={styles.years} aria-label="Jump to year">
              {years.map((y) => (
                <a key={y} href={`#y${y}`} className="hz-mono">
                  {y}
                </a>
              ))}
            </nav>
          }
        />
      </Section>

      {/* ── photo galleries (reali) ── */}
      {withGalleries.length > 0 && (
        <Section surface="paper" space="lg">
          <SectionLabel kicker="Photo galleries" title="From the floor." />
          <div className={styles.galGrid}>
            {withGalleries.map((e) => {
              const photos = galleryFor(e.n)
              return (
                <Link key={e.n} href={`/events/${eventSlug(e)}#gallery`} className={styles.galCard}>
                  <div className={styles.galThumbs}>
                    {photos.slice(0, 3).map((src) => (
                      <ImageFrame key={src} src={src} alt={`${e.title} archive`} ratio="1 / 1" className={styles.thumb} />
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

      {/* ── by year ── */}
      {byYear.map(({ y, events }, i) => (
        <Section key={y} surface={i % 2 === 0 ? 'white' : 'paper'} space="md" id={`y${y}`}>
          <SectionLabel kicker="Season" title={String(y)} />
          <div>
            {events.map((e) => (
              <EventRow key={e.n} event={e} />
            ))}
          </div>
        </Section>
      ))}
    </main>
  )
}
