import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import FeaturedEvent from '@/components/events/FeaturedEvent'
import EventFilters from '@/components/events/EventFilters'
import ArchiveTable from '@/components/events/ArchiveTable'
import { upcoming, archive } from '@/content/events'
import styles from './events.module.css'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Il calendario Hertz: date minimal & deep tech a Bologna e in Emilia-Romagna. Line-up, venue e stato biglietti.',
  alternates: { canonical: '/events' },
}

export default function EventsPage() {
  const up = upcoming()
  const past = archive()
  const feature = up.find((e) => e.poster) ?? up[0]
  const rest = up.filter((e) => e.n !== feature?.n)

  return (
    <main id="main">
      <Section surface="white" space="md" style={{ paddingTop: 'var(--hz-section-sm)' }}>
        {/* intro compatta come modulo bordato */}
        <div className={styles.intro}>
          <div className={styles.introMain}>
            <p className={`${styles.introKicker} hz-mono`}>01 / Events</p>
            <h1 className={styles.introTitle}>On the calendar.</h1>
          </div>
          <div className={styles.introSide}>
            <p className={styles.introDesc}>
              Independent nights across Bologna and Emilia-Romagna — booked like we&rsquo;d pay to see
              them ourselves. Dates, venues and line-ups stay stable while the visuals move.
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
          <h2 className={styles.archiveTitle}>Played out.</h2>
          <span className={`${styles.archiveCount} hz-mono`}>{past.length} nights</span>
        </div>
        <ArchiveTable events={past} />
      </Section>
    </main>
  )
}
