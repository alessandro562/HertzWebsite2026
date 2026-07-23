/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, eventYear } from '@/content/events'
import Arrow from '@/components/ui/Arrow'
import styles from './ArchiveTable.module.css'

/**
 * ArchiveTable — gli eventi passati come TABELLA editoriale densa (righe basse,
 * anno visibile, poster monocromo piccolo, meno motion). Volutamente diversa
 * dai moduli upcoming: stesso dato, componente e presenza differenti.
 */
export default function ArchiveTable({ events }: { events: HertzEvent[] }) {
  return (
    <div className={styles.table} role="table" aria-label="Archived events">
      <div className={`${styles.head} hz-mono`} role="row">
        <span role="columnheader">N°</span>
        <span role="columnheader" />
        <span role="columnheader">Event</span>
        <span role="columnheader">Venue</span>
        <span role="columnheader">Date</span>
        <span role="columnheader">Year</span>
      </div>
      {events.map((e) => (
        <Link key={e.n} href={`/events/${eventSlug(e)}`} className={`${styles.row} hz-rowfx`} role="row">
          <span className={`${styles.n} hz-mono`}>N°{e.n}</span>
          <span className={styles.thumb} aria-hidden="true">
            {e.poster ? <img src={e.poster} alt="" loading="lazy" decoding="async" /> : <span className={styles.thumbEmpty} />}
          </span>
          <span className={styles.title}>{e.title}</span>
          <span className={styles.venue}>
            {e.venue} · {e.city}
          </span>
          <span className={`${styles.date} hz-mono`}>{dowDate(e)}</span>
          <span className={`${styles.year} hz-mono`}>{eventYear(e)}</span>
          <span className={styles.arrow} aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      ))}
    </div>
  )
}
