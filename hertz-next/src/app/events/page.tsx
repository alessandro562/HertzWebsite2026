import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import EventRow from '@/components/events/EventRow'
import EventFilters from '@/components/events/EventFilters'
import EventPosterPortal from '@/components/events/EventPosterPortal'
import Link from 'next/link'
import { upcoming, archive, dowDate, eventSlug } from '@/content/events'
import type { Status } from '@/components/ui/StatusBadge'
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
  const feature = up.find((e) => e.poster)

  return (
    <main id="main">
      <Section surface="white" space="lg" style={{ paddingTop: 'var(--hz-section-sm)' }}>
        <PageHeader
          index="01"
          kicker="Events"
          title="On the calendar."
          intro={
            <p>
              Independent nights across Bologna and Emilia-Romagna — booked like we&rsquo;d pay to
              see them ourselves. Dates, venues and line-ups stay stable while the visuals move.
            </p>
          }
          aside={
            <p className="hz-mono">
              {up.length} upcoming · {past.length} archived
            </p>
          }
        />

        {up.length > 0 ? (
          <EventFilters events={up} />
        ) : (
          <p className={styles.empty}>No dates on sale right now — new events announced soon.</p>
        )}
      </Section>

      {feature && (
        <Section surface="paper" space="lg">
          <SectionLabel index="02" kicker="Featured" title="Next poster." />
          <div className={styles.feature}>
            <EventPosterPortal
              image={feature.poster}
              n={feature.n}
              status={(feature.onSale ? 'on-sale' : 'soon') as Status}
              date={dowDate(feature)}
              title={feature.title}
              venue={feature.venue}
              href={`/events/${eventSlug(feature)}`}
              viewTransitionName={`event-poster-${eventSlug(feature)}`}
              priority
              className={styles.featureImg}
            />
            <div className={styles.featureMeta}>
              <span className="hz-mono">
                N°{feature.n} · {dowDate(feature)}
              </span>
              <h3 className={styles.featureTitle}>
                <Link href={`/events/${eventSlug(feature)}`}>{feature.title}</Link>
              </h3>
              <p className={styles.featureVenue}>
                {feature.venue} · {feature.city}
              </p>
              {feature.bill && <p className={styles.featureBill}>{feature.bill}</p>}
              <Link href={`/events/${eventSlug(feature)}`} className={styles.featureCta}>
                View event ↗
              </Link>
            </div>
          </div>
        </Section>
      )}

      <Section surface="white" space="lg">
        <SectionLabel
          index="03"
          kicker="Archive"
          title="Recently."
          link={{ href: '/archive', label: 'Full archive ↗' }}
        />
        <div className={styles.list}>
          {past.slice(0, 6).map((e) => (
            <EventRow key={e.n} event={e} />
          ))}
        </div>
        <div className={styles.more}>
          <Button href="/archive" variant="ghost" arrow>
            Open the archive
          </Button>
        </div>
      </Section>
    </main>
  )
}
