import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import DepartureBoard from '@/components/events/DepartureBoard'
import FeaturedEvent from '@/components/events/FeaturedEvent'
import EventFilters from '@/components/events/EventFilters'
import ArchiveTable from '@/components/events/ArchiveTable'
import { upcoming, archive, eventSlug, eventYear } from '@/content/events'
import { SITE } from '@/lib/site'
import styles from './events.module.css'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Il calendario Hertz: date minimal & deep tech a Bologna e in Italia. Line-up, venue e stato biglietti.',
  alternates: { canonical: '/events' },
}

export default function EventsPage() {
  const up = upcoming()
  const past = archive()
  const feature = up.find((e) => e.poster) ?? up[0]
  const rest = up.filter((e) => e.n !== feature?.n)

  const pastYears = [...new Set(past.map(eventYear))]
  const pastRange = past.length
    ? `N°${past[past.length - 1].n} → ${past[0].n}`
    : ''

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

      <Section surface="white" space="md" style={{ paddingTop: 'var(--hz-section-sm)' }}>
        {/* intro compatta come modulo bordato */}
        <div className={styles.intro}>
          <div className={styles.introMain}>
            <p className={`${styles.introKicker} hz-mono`}>01 / Events</p>
            <h1 className={styles.introTitle}>Next gigs.</h1>
          </div>
          <div className={styles.introSide}>
            <p className={styles.introDesc}>
              Independent nights across Bologna and central Italy — minimal &amp; deep tech, booked
              like we&rsquo;d pay to see them ourselves.
            </p>
            <dl className={`${styles.introCount} hz-mono`}>
              <div>
                <dt>Upcoming</dt>
                <dd>{up.length}</dd>
              </div>
              <div>
                <dt>Archived</dt>
                <dd>{past.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* ── DEPARTURES · live board (ink) ── */}
      {up.length > 0 && (
        <Section surface="ink" space="lg">
          <DepartureBoard events={up} />
        </Section>
      )}

      <Section surface="white" space="lg">
        {feature && (
          <div className={styles.featuredWrap}>
            <FeaturedEvent event={feature} />
          </div>
        )}

        {rest.length > 0 && (
          <div className={styles.upcoming}>
            <EventFilters events={rest} />
          </div>
        )}
      </Section>

      <Section surface="paper" space="lg">
        <div className={styles.archiveHead}>
          <p className={`${styles.introKicker} hz-mono`}>02 / Archive</p>
          <h2 className={styles.archiveTitle}>Rewind.</h2>
          <span className={`${styles.archiveCount} hz-mono`}>
            Past transmissions · {pastYears.join('–')} · {pastRange}
          </span>
        </div>
        <ArchiveTable events={past} />
      </Section>
    </main>
  )
}
