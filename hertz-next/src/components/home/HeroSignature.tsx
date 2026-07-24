'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import styles from './HeroSignature.module.css'

export interface HeroSignatureEvent {
  venue: string
  city: string
  date: string
  slug: string
}

/**
 * HeroSignature — chiude la hero come una FIRMA di stampa in basso a destra:
 * una riga hairline che "si disegna" da sinistra e, appesa sotto, il lockup
 * UFFICIALE hertz (sinusoide + wordmark) usato in grande come segno d'autore.
 * A sinistra un dettaglio mono col prossimo evento reale → dà al simbolo un
 * motivo (firma la dichiarazione tipografica sopra) invece di galleggiare.
 * Reduced-motion → tutto statico.
 */
export default function HeroSignature({ next }: { next?: HeroSignatureEvent }) {
  const reduce = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <div className={styles.signature}>
      <motion.span
        className={styles.rule}
        aria-hidden="true"
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.55, ease }}
      />

      <div className={styles.row}>
        <motion.div
          className={styles.meta}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.9, ease }}
        >
          <span className={`${styles.metaLine} hz-mono`}>The clubbing collective</span>
          {next && (
            <Link href={`/events/${next.slug}`} className={`${styles.nextLink} hz-mono`}>
              ↓ Next · {next.venue} · {next.date}
            </Link>
          )}
        </motion.div>

        <motion.span
          className={styles.mark}
          role="img"
          aria-label="Hertz Clubbing Collective"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.75, ease }}
        />
      </div>
    </div>
  )
}
