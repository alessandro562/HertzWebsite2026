import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import ImageFrame from '@/components/ui/ImageFrame'
import ImageReveal from '@/motion/ImageReveal'
import ArchiveExplorer from '@/components/archive/ArchiveExplorer'
import { archive, eventYear, eventSlug, shortDate, dowDate } from '@/content/events'
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
  const withGalleries = past.filter((e) => galleryFor(e.n).length > 0)
  const items = past.map((e) => ({
    n: e.n,
    title: e.title,
    venue: e.venue,
    city: e.city,
    year: eventYear(e),
    slug: eventSlug(e),
    date: dowDate(e),
  }))

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
          aside={<p className="hz-mono">{items.length} nights archived</p>}
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

      {/* ── sessions: filtro anno + DISORDER ── */}
      <Section surface="white" space="lg">
        <SectionLabel kicker="Sessions" title="Every night." />
        <ArchiveExplorer items={items} years={years} />
      </Section>
    </main>
  )
}
