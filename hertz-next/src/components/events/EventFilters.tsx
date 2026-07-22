'use client'

import { useMemo, useState } from 'react'
import { type HertzEvent } from '@/content/events'
import EventModule from './EventModule'
import styles from './EventFilters.module.css'

type Filter = 'all' | 'on-sale' | 'soon'

/**
 * Header "Upcoming" + filtro di stato integrato + lista di EventModule.
 * Il filtro (All / On sale / Coming soon) è l'unico utile sul dataset reale;
 * client-side, nessuna richiesta di rete. Comprensibile anche senza motion.
 */
export default function EventFilters({ events }: { events: HertzEvent[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(
    () => ({
      all: events.length,
      'on-sale': events.filter((e) => e.onSale).length,
      soon: events.filter((e) => !e.onSale).length,
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
      <div className={styles.bar}>
        <span className={`${styles.label} hz-mono`}>More upcoming</span>
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
              {f === 'all' ? 'All' : f === 'on-sale' ? 'On sale' : 'Soon'}
              <span className={styles.count}>{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.list}>
        {filtered.length > 0 ? (
          filtered.map((e) => <EventModule key={e.n} event={e} />)
        ) : (
          <p className={styles.empty}>No dates match this filter right now.</p>
        )}
      </div>
    </div>
  )
}
