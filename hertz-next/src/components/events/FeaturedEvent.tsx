/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import FrequencyCut from '@/motion/FrequencyCut'
import PosterFX from '@/components/ui/PosterFX'
import PosterFallback from './PosterFallback'
import styles from './FeaturedEvent.module.css'

/**
 * FeaturedEvent — il prossimo evento come modulo full-width. La LOCANDINA è
 * verticale e mostrata INTERA (rapporto naturale, mai croppata), con la cornice
 * print (PosterFX); il contenuto (titolo, venue, line-up, CTA) sta a fianco.
 * Hover (CSS): keyline che attraversa, CTA attiva.
 */
export default function FeaturedEvent({ event }: { event: HertzEvent }) {
  const past = isPast(event)
  const status: Status = past ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)

  return (
    <Link
      href={`/events/${slug}`}
      className={styles.featured}
      data-status={status}
      style={{ viewTransitionName: `event-frame-${slug}` } as CSSProperties}
    >
      <div className={styles.posterCell}>
        {event.poster ? (
          <figure className={styles.posterFig}>
            <img
              src={event.poster}
              alt={`Poster — ${event.title}`}
              className={styles.poster}
              loading="eager"
              decoding="async"
            />
            <PosterFX tone="dark" />
            <div className={styles.posterTag}>
              <span className="hz-mono">N°{event.n}</span>
              {event.badge && <span className={`${styles.badge} hz-mono`}>{event.badge}</span>}
              <StatusBadge status={status} />
            </div>
          </figure>
        ) : (
          <div className={styles.posterFig} data-fallback="true">
            <PosterFallback n={event.n} date={dowDate(event)} city={event.city} className={styles.posterSoon} />
            <div className={styles.posterTag}>
              <span className="hz-mono">N°{event.n}</span>
              {event.badge && <span className={`${styles.badge} hz-mono`}>{event.badge}</span>}
              <StatusBadge status={status} />
            </div>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <span className={`${styles.kicker} hz-mono`}>Next event</span>
          <span className={`${styles.date} hz-mono`}>
            {dowDate(event)}
            {event.time ? ` · ${event.time.replace(/^[A-Z]{3} · /, '')}` : ''}
          </span>
        </div>

        <div className={styles.cut}>
          <FrequencyCut variant="editorial" trigger="inView" />
        </div>

        <div className={styles.mid}>
          <h2 className={styles.title}>{event.title}</h2>
          <p className={styles.venue}>
            {event.venue} · {event.city}
          </p>
          {event.bill && <p className={styles.bill}>{event.bill}</p>}
        </div>

        <div className={styles.foot}>
          <span className={`${styles.footLabel} hz-mono`}>
            {status === 'on-sale' ? 'Guest list open' : status === 'soon' ? 'Line-up soon' : 'Archived'}
          </span>
          <span className={styles.cta}>View event ↗</span>
        </div>
      </div>

      <span className={styles.sweep} aria-hidden="true" />
    </Link>
  )
}
