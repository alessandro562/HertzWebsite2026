import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import styles from './EventRow.module.css'

/** Riga di calendario editoriale → pagina evento. Stato derivato da data/onSale. */
export default function EventRow({ event }: { event: HertzEvent }) {
  const status: Status = isPast(event) ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  return (
    <Link href={`/events/${eventSlug(event)}`} className={styles.row}>
      <span className={`${styles.n} hz-mono`}>N°{event.n}</span>
      <span className={`${styles.date} hz-mono`}>{dowDate(event)}</span>
      <span className={styles.main}>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.venue}>
          {event.venue} · {event.city}
        </span>
      </span>
      <span className={styles.right}>
        {event.badge && <span className={`${styles.badge} hz-mono`}>{event.badge}</span>}
        <StatusBadge status={status} />
        <span className={styles.arrow} aria-hidden="true">
          ↗
        </span>
      </span>
    </Link>
  )
}
