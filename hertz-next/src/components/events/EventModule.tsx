/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import Arrow from '@/components/ui/Arrow'
import PosterFallback from './PosterFallback'
import styles from './EventModule.module.css'

/**
 * EventModule — riga evento della lista "More upcoming": locandina PICCOLA
 * laterale (4:5 monocroma, come nel rewind) + data · titolo · venue · stato.
 * La locandina grande vive solo nella pagina dell'evento.
 */
export default function EventModule({ event }: { event: HertzEvent }) {
  const past = isPast(event)
  const status: Status = past ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)

  return (
    <Link href={`/events/${slug}`} className={`${styles.row} hz-rowfx`} data-status={status}>
      <span className={styles.thumb} aria-hidden="true">
        {event.poster ? (
          <img
            src={event.poster}
            alt=""
            className={styles.thumbImg}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <PosterFallback n={event.n} date={dowDate(event)} city={event.city} className={styles.thumbFallback} />
        )}
      </span>
      <span className={styles.body}>
        <span className={`${styles.date} hz-mono`}>
          {dowDate(event)} · N°{event.n}
        </span>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.venue}>
          {event.venue} · {event.city}
        </span>
      </span>
      <span className={styles.status}>
        <StatusBadge status={status} />
      </span>
      <span className={`${styles.arrow} hz-fx-arrow`} aria-hidden="true">
        <Arrow />
      </span>
    </Link>
  )
}
