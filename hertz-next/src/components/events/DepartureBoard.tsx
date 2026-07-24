import Link from 'next/link'
import { eventSlug, dowDate, type HertzEvent } from '@/content/events'
import styles from './DepartureBoard.module.css'

/**
 * DEPARTURES · LIVE BOARD — tabellone editoriale delle prossime date (tema
 * "arrivi"): Date / Event / Venue / City / Status. La più imminente è marcata
 * con ▸. Server component (SSR-safe); status reale da onSale/comingSoon.
 */
export default function DepartureBoard({ events }: { events: HertzEvent[] }) {
  if (events.length === 0) return null
  return (
    <div className={styles.board}>
      <div className={styles.head}>
        <h2 className={styles.title}>What&rsquo;s next.</h2>
      </div>

      <div className={styles.table}>
        <div className={`${styles.row} ${styles.headerRow} hz-mono`} aria-hidden="true">
          <span>Date</span>
          <span>Event</span>
          <span className={styles.hv}>Venue</span>
          <span className={styles.hc}>City</span>
          <span className={styles.statCol}>Status</span>
        </div>
        {events.map((e, i) => {
          const onSale = !e.comingSoon && e.onSale
          return (
            <Link
              key={e.n}
              href={`/events/${eventSlug(e)}`}
              className={styles.row}
              data-next={i === 0 || undefined}
            >
              <span className={`${styles.date} hz-mono`}>
                {i === 0 && (
                  <b className={styles.mark} aria-hidden="true">
                    ▸
                  </b>
                )}
                {dowDate(e)}
              </span>
              <span className={styles.event}>{e.title}</span>
              <span className={`${styles.venue} hz-mono`}>{e.venue}</span>
              <span className={`${styles.city} hz-mono`}>{e.city}</span>
              <span className={`${styles.stat} hz-mono`} data-status={onSale ? 'on-sale' : 'soon'}>
                {onSale ? 'On sale' : 'Soon'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
