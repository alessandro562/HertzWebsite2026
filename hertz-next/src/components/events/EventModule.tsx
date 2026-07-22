/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, isPast } from '@/content/events'
import StatusBadge, { type Status } from '@/components/ui/StatusBadge'
import ViewMorph from '@/motion/ViewMorph'
import PosterFallback from './PosterFallback'
import styles from './EventModule.module.css'

/**
 * EventModule — modulo editoriale di calendario (upcoming). Non una riga nuda:
 * un frame 1px con tre aree interne separate da keyline (numero/data ·
 * titolo/venue/lineup · status/preview/CTA), poster preview sempre visibile,
 * stati distinti (on-sale/soon/sold-out), e una linea di frequenza strutturale
 * che attraversa il bordo inferiore all'hover/focus. La linea di navigazione
 * (PageTransitionProvider) apre poi la pagina evento.
 */
export default function EventModule({ event }: { event: HertzEvent }) {
  const past = isPast(event)
  const status: Status = past ? 'archive' : event.onSale ? 'on-sale' : 'soon'
  const slug = eventSlug(event)
  const bill = event.bill ? event.bill.split('·').slice(0, 3).map((s) => s.trim()).join(' · ') : null

  return (
    <Link href={`/events/${slug}`} className={styles.module} data-status={status}>
      <div className={`${styles.cell} ${styles.ident}`}>
        <span className={`${styles.num} hz-mono`}>N°{event.n}</span>
        <span className={`${styles.date} hz-mono`}>{dowDate(event)}</span>
      </div>

      <div className={`${styles.cell} ${styles.main}`}>
        <ViewMorph name={`event-title-${slug}`}>
          <span className={styles.title}>{event.title}</span>
        </ViewMorph>
        <span className={styles.venue}>
          {event.venue} · {event.city}
        </span>
        {bill && <span className={`${styles.bill} hz-mono`}>{bill}</span>}
      </div>

      <div className={`${styles.cell} ${styles.aside}`}>
        <div className={styles.asideTop}>
          <StatusBadge status={status} />
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </div>
        <div className={styles.preview} aria-hidden="true">
          {event.poster ? (
            <img src={event.poster} alt="" loading="lazy" decoding="async" />
          ) : (
            <PosterFallback n={event.n} date={dowDate(event)} city={event.city} />
          )}
        </div>
      </div>

      <span className={styles.sweep} aria-hidden="true" />
    </Link>
  )
}
