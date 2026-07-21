import type { Metadata } from 'next'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import ImageFrame from '@/components/ui/ImageFrame'
import EventRow from '@/components/events/EventRow'
import { upcoming, archive, dowDate, eventSlug } from '@/content/events'
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
      <Section surface="white" space="lg">
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

        <div className={styles.list}>
          {up.length > 0 ? (
            up.map((e) => <EventRow key={e.n} event={e} />)
          ) : (
            <p className={styles.empty}>No dates on sale right now — new events announced soon.</p>
          )}
        </div>
      </Section>

      {feature && (
        <Section surface="paper" space="lg">
          <SectionLabel index="02" kicker="Featured" title="Next poster." />
          <Link href={`/events/${eventSlug(feature)}`} className={styles.feature}>
            <ImageFrame
              src={feature.poster}
              alt={`Poster — ${feature.title}`}
              ratio="4 / 5"
              className={styles.featureImg}
            />
            <div className={styles.featureMeta}>
              <span className="hz-mono">
                N°{feature.n} · {dowDate(feature)}
              </span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureVenue}>
                {feature.venue} · {feature.city}
              </p>
              {feature.bill && <p className={styles.featureBill}>{feature.bill}</p>}
              <span className={styles.featureCta}>View event ↗</span>
            </div>
          </Link>
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
