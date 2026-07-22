'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import StatusBadge from '@/components/ui/StatusBadge'
import { useEnableMotion } from '@/motion/useEnableMotion'
import styles from './ArchiveExplorer.module.css'

export interface ArchiveItem {
  n: string
  title: string
  venue: string
  city: string
  year: number
  slug: string
  date: string
  lineup?: string[]
  hasGallery?: boolean
}

/**
 * Archivio interattivo (WICKED NIGHTS): filtro per anno con ricomposizione
 * animata (layout), modalità DISORDER opzionale (caos controllato, toggle).
 * Modalità normale pulita e facile. Reduced-motion → swap statico.
 */
export default function ArchiveExplorer({ items, years }: { items: ArchiveItem[]; years: number[] }) {
  const [year, setYear] = useState<number | 'all'>('all')
  const [disorder, setDisorder] = useState(false)
  const enabled = useEnableMotion()
  const shown = year === 'all' ? items : items.filter((i) => i.year === year)

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.years} role="tablist" aria-label="Filter by year">
          <button
            type="button"
            className={styles.chip}
            data-active={year === 'all'}
            onClick={() => setYear('all')}
          >
            All <span className="hz-mono">{items.length}</span>
          </button>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={styles.chip}
              data-active={year === y}
              onClick={() => setYear(y)}
            >
              {y} <span className="hz-mono">{items.filter((i) => i.year === y).length}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.disorder}
          data-on={disorder}
          onClick={() => setDisorder((d) => !d)}
          aria-pressed={disorder}
        >
          {disorder ? '↺ Order' : '⤫ Disorder'}
        </button>
      </div>

      <motion.div layout className={styles.list} data-disorder={disorder}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((it, i) => (
            <motion.div
              key={it.n}
              layout={enabled}
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: disorder ? ((i % 3) - 1) * 1.4 : 0,
                x: disorder ? (i % 2 ? 16 : -10) : 0,
              }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/events/${it.slug}`} className={styles.row}>
                <span className={`${styles.n} hz-mono`}>N°{it.n}</span>
                <span className={`${styles.date} hz-mono`}>{it.date}</span>
                <span className={styles.main}>
                  <span className={styles.title}>{it.title}</span>
                  <span className={styles.venue}>
                    {it.venue} · {it.city}
                    {it.lineup && it.lineup.length > 0 && ` · ${it.lineup.join(' · ')}`}
                  </span>
                </span>
                {it.hasGallery && <span className={`${styles.galleryMark} hz-mono`}>{'▦'} gallery</span>}
                <StatusBadge status="archive" />
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
