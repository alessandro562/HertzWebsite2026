'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import Arrow from '@/components/ui/Arrow'
import styles from './HeroSignature.module.css'

export interface HeroSignatureEvent {
  title: string
  venue: string
  city: string
  date: string
  slug: string
  onSale?: boolean
}

/**
 * HeroSignature — chiude la hero come una FIRMA di stampa: riga hairline che
 * "si disegna" da sinistra, lockup ufficiale hertz a destra come segno d'autore.
 * A sinistra il PROSSIMO EVENTO con la sua azione: è l'unica cosa azionabile
 * above the fold per chi viene a ballare, quindi ha peso tipografico reale e un
 * bottone da 44px, non una riga di metadati. La CTA è onesta: "Join the list"
 * solo quando la lista è aperta, altrimenti "View event".
 * Reduced-motion → tutto statico.
 */
export default function HeroSignature({ next }: { next?: HeroSignatureEvent }) {
  const reduce = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const
  const href = next ? `/events/${next.slug}` : '/events'

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
          className={styles.next}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.9, ease }}
        >
          {next ? (
            <>
              <span className={`${styles.kicker} hz-mono`}>Next date</span>
              <Link href={href} className={styles.title}>
                {next.title}
              </Link>
              <span className={`${styles.meta} hz-mono`}>
                {next.venue} · {next.city} · {next.date}
              </span>
              <Link href={href} className={`${styles.cta} hz-mono`}>
                {next.onSale ? 'Join the list' : 'View event'} <Arrow />
              </Link>
            </>
          ) : (
            <>
              <span className={`${styles.kicker} hz-mono`}>Calendar</span>
              <Link href="/events" className={styles.title}>
                Next dates
              </Link>
              <Link href="/events" className={`${styles.cta} hz-mono`}>
                All events <Arrow />
              </Link>
            </>
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
