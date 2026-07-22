'use client'

import { useMemo, useState } from 'react'
import { type HertzEvent, isPast } from '@/content/events'
import EventRow from './EventRow'
import styles from './EventFilters.module.css'

type Filter = 'all' | 'on-sale' | 'soon'

/**
 * Filtro di stato per il calendario upcoming — l'unico filtro davvero utile
 * dato il dataset reale (solo 2 anni, 4 città, poco affollato): "cosa posso
 * prenotare ORA" vs "date ancora da annunciare". Client-side, nessuna
 * richiesta di rete. Il calendario resta comprensibile anche senza motion.
 */
export default function EventFilters({ events }: { events: HertzEvent[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(
    () => ({
      all: events.length,
      'on-sale': events.filter((e) => !isPast(e) && e.onSale).length,
      soon: events.filter((e) => !isPast(e) && !e.onSale).length,
    }),
    [events],
  )

  const filtered = events.filter((e) => {
    if (filter === 'on-sale') return e.onSale
    if (filter === 'soon') return !e.onSale
    return true
  })

  return (
    <div>
      <div className={styles.chips} role="group" aria-label="Filter events by status">
        {(['all', 'on-sale', 'soon'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.chip} hz-mono`}
            data-active={filter === f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'on-sale' ? 'On sale' : 'Coming soon'}
            <span className={styles.count}>{counts[f]}</span>
          </button>
        ))}
      </div>
      <div className={styles.list}>
        {filtered.length > 0 ? (
          filtered.map((e) => <EventRow key={e.n} event={e} />)
        ) : (
          <p className={styles.empty}>No dates match this filter right now.</p>
        )}
      </div>
    </div>
  )
}
