import Image from 'next/image'
import Link from 'next/link'
import { type HertzEvent, dowDate, eventSlug, eventYear } from '@/content/events'
import Arrow from '@/components/ui/Arrow'
import styles from './ArchiveTable.module.css'

/**
 * ArchiveTable — gli eventi passati come TABELLA editoriale densa (righe basse,
 * anno visibile, poster monocromo piccolo, meno motion). Volutamente diversa
 * dai moduli upcoming: stesso dato, componente e presenza differenti.
 *
 * La griglia è tabellare a vedersi ma NON è una tabella per lo screen reader:
 * ogni riga è un link a una pagina evento. Prima portava role="table" e
 * role="row" sull'<a>, che sostituiva il ruolo "link" con "row" — la riga non
 * veniva più annunciata come attivabile né compariva nella lista dei link, e
 * la tabella restava comunque malformata (le celle non avevano un ruolo).
 * Ora: sequenza di link, ognuno con l'etichetta completa; l'intestazione è
 * decorativa, visto che ogni link ripete già tutti i dati.
 */
export default function ArchiveTable({ events }: { events: HertzEvent[] }) {
  return (
    <div className={styles.table}>
      <div className={`${styles.head} hz-mono`} aria-hidden="true">
        <span />
        <span>Event</span>
        <span>Venue</span>
        <span>Date</span>
        <span>Year</span>
      </div>
      {events.map((e) => (
        <Link
          key={e.n}
          href={`/events/${eventSlug(e)}`}
          className={`${styles.row} hz-rowfx`}
          aria-label={`${e.title}, ${e.venue}, ${e.city}, ${dowDate(e)}`}
        >
          <span className={styles.thumb} aria-hidden="true">
            {/* miniatura 28x34: prima serviva la locandina intera (~300KB l'una,
                13 righe). */}
            {e.poster ? (
              <Image src={e.poster} alt="" fill sizes="28px" />
            ) : (
              <span className={styles.thumbEmpty} />
            )}
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
