import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import DepartureBoard from '@/components/events/DepartureBoard'
import FeaturedEvent from '@/components/events/FeaturedEvent'
import ArchiveTable from '@/components/events/ArchiveTable'
import { upcoming, archive, eventSlug, eventYear } from '@/content/events'
import { SITE } from '@/lib/site'
import styles from './events.module.css'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'The Hertz calendar: minimal and deep tech nights in Bologna and across Italy. Line-up, venue and ticket status.',
  alternates: { canonical: '/events' },
}

export default function EventsPage() {
  const up = upcoming()
  const past = archive()
  const feature = up.find((e) => e.poster) ?? up[0]

  const pastYears = [...new Set(past.map(eventYear))]

  /* JSON-LD aggregato di tutte le date upcoming (parità SEO col vecchio /events) */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': up.map((e) => ({
      '@type': 'Event',
      name: e.title,
      startDate: e.iso,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: e.venue,
        address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'IT' },
      },
      organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      url: `${SITE.url}/events/${eventSlug(e)}`,
    })),
  }

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Intro + prossima data in evidenza sulla STESSA superficie: la locandina
          sale in alto, subito dopo il titolo. Il calendario completo arriva
          sotto (DepartureBoard), che elenca già tutto con lo stato: prima
          queste due sezioni ripetevano gli stessi eventi due volte. */}
      <Section surface="white" space="md" style={{ paddingTop: 'var(--hz-section-sm)' }}>
        <div className={styles.intro}>
          <div className={styles.introHead}>
            <p className={`${styles.introKicker} hz-mono`}>Events</p>
            <h1 className={styles.introTitle}>Next gigs.</h1>
          </div>
          <div className={styles.introAside}>
            <p className={styles.introLede}>
              Every Hertz night, past and upcoming. Minimal &amp; deep tech across Bologna and
              central Italy, made for the floor first.
            </p>
          </div>
        </div>

        {feature && (
          <div className={styles.featuredWrap}>
            <FeaturedEvent event={feature} />
          </div>
        )}
      </Section>

      {/* ── DEPARTURES · calendario completo delle date in arrivo (ink) ── */}
      {up.length > 0 && (
        <Section surface="ink" space="lg">
          <DepartureBoard events={up} />
        </Section>
      )}

      <Section surface="paper" space="lg">
        <div className={styles.archiveHead}>
          <p className={`${styles.introKicker} hz-mono`}>Archive</p>
          <h2 className={styles.archiveTitle}>Rewind.</h2>
          <span className={`${styles.archiveCount} hz-mono`}>
            Past transmissions · {pastYears.join('–')}
          </span>
        </div>
        <ArchiveTable events={past} />
      </Section>
    </main>
  )
}
