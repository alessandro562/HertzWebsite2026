import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import Arrow from '@/components/ui/Arrow'
import ViewMorph from '@/motion/ViewMorph'
import styles from './EventRow.module.css'

/** Riga di calendario editoriale → pagina evento. Stato derivato da data/onSale.
 *  Su desktop, l'hover rivela un'anteprima del poster (CSS-only, nessun JS
 *  per riga — leggero anche con molte righe in lista); su mobile il tap
 *  naviga direttamente alla pagina evento, dove il poster grande È la
 *  rivelazione (via shared transition). */
export default function EventRow({ event }: { event: HertzEvent }) {
  const status: Status = isPast(event) ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)
  return (
    <Link href={`/events/${slug}`} className={`${styles.row} hz-rowfx`}>
      <span className={`${styles.date} hz-mono`}>{dowDate(event)}</span>
      <span className={styles.main}>
        <ViewMorph name={`event-title-${slug}`}>
          <span className={styles.title}>{event.title}</span>
        </ViewMorph>
        <span className={styles.venue}>
          {event.venue} · {event.city}
        </span>
      </span>
      <span className={styles.right}>
        {event.badge && <span className={`${styles.badge} hz-mono`}>{event.badge}</span>}
        <StatusBadge status={status} />
        <span className={styles.arrow} aria-hidden="true">
          <Arrow />
        </span>
      </span>
      {event.poster && (
        <span className={styles.preview} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.poster} alt="" loading="lazy" decoding="async" />
        </span>
      )}
    </Link>
  )
}
