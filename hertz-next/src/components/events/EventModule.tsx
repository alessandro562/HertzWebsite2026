/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import Arrow from '@/components/ui/Arrow'
import PosterFX from '@/components/ui/PosterFX'
import PosterFallback from './PosterFallback'
import styles from './EventModule.module.css'

/**
 * EventModule — card evento verticale per la griglia "More upcoming":
 * locandina 4:5 (post Instagram) con cornice print, poi data · titolo · venue.
 * Locandina mancante → fallback "coming soon" allo stesso rapporto.
 */
export default function EventModule({ event }: { event: HertzEvent }) {
  const past = isPast(event)
  const status: Status = past ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)

  return (
    <Link href={`/events/${slug}`} className={`${styles.card} hz-cardfx`} data-status={status}>
      <div className={styles.posterWrap}>
        {event.poster ? (
          <>
            <img
              src={event.poster}
              alt={`Poster: ${event.title}`}
              className={styles.poster}
              loading="lazy"
              decoding="async"
            />
            <PosterFX tone="dark" />
          </>
        ) : (
          <PosterFallback n={event.n} date={dowDate(event)} city={event.city} className={styles.posterSoon} />
        )}
        <div className={styles.tag}>
          <span className="hz-mono">N°{event.n}</span>
          <StatusBadge status={status} />
        </div>
        <span className={styles.arrow} aria-hidden="true">
          <Arrow />
        </span>
      </div>
      <div className={styles.meta}>
        <span className={`${styles.date} hz-mono`}>{dowDate(event)}</span>
        <h3 className={styles.title}>{event.title}</h3>
        <span className={styles.venue}>
          {event.venue} · {event.city}
        </span>
      </div>
    </Link>
  )
}
