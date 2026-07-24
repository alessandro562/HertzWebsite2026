'use client'

import Link from 'next/link'
import { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'motion/react'
import SignatureTitle from '@/motion/SignatureTitle'
import Button from '@/components/ui/Button'
import { useEnableMotion } from '@/motion/useEnableMotion'
import HeroSignalGrid from './HeroSignalGrid'
import styles from './HomeHero.module.css'

export interface NextEvent {
  n: string
  title: string
  venue: string
  city: string
  date: string
  slug: string
  onSale?: boolean
  comingSoon?: boolean
}

/**
 * Hero homepage — composizione firma su superficie Signal.
 * Layering titolo/foto, grid ambientale, waveform animata, entrata
 * tipografica a maschera, parallax immagine, passaggio verso gli eventi.
 * Struttura DOM stabile (SSR-safe): reduced-motion via MotionConfig +
 * gating parallax con useEnableMotion.
 */
export default function HomeHero({ next }: { next?: NextEvent }) {
  const root = useRef<HTMLElement>(null)
  const enabled = useEnableMotion()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  // La frequenza che deforma la griglia attraversa anche il contenuto: titolo,
  // foto e prossimo evento cavalcano la loro colonna e tornano allineati (ORDER).
  const titleX = useMotionValue(0)
  const photoX = useMotionValue(0)
  const metaX = useMotionValue(0)
  const onWave = useCallback(
    (disp: (x01: number) => number) => {
      titleX.set(disp(0.26) * 7)
      photoX.set(disp(0.72) * 11)
      metaX.set(disp(0.22) * 5)
    },
    [titleX, photoX, metaX],
  )

  const ticketsHref = next ? `/events/${next.slug}` : '/events'

  return (
    <section ref={root} data-surface="signal" className={styles.hero} id="top">
      <HeroSignalGrid onWave={onWave} />

      <div className={`hz-container ${styles.inner}`}>
        <motion.p
          className={`${styles.kicker} hz-mono`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Clubbing collective · Bologna · since 2023
        </motion.p>

        <div className={styles.stage}>
          <motion.div className={styles.titleCol} style={{ x: titleX }}>
            <SignatureTitle as="h1" className={styles.title} stagger={0.12} trigger="mount">
              <span className={styles.l1}>From clubbers,</span>
              <span className={styles.l2}>for clubbers.</span>
            </SignatureTitle>

            <motion.p
              className={styles.sub}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              A minimal / deep-tech clubbing collective in Bologna: a resident night, a roster, an
              editorial, built around the selection and the floor.
            </motion.p>
          </motion.div>

          <motion.figure
            className={styles.photoWrap}
            style={enabled ? { y: photoY, x: photoX } : undefined}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/hero-booth.jpg" alt="Hertz, the booth during an event" className={styles.photo} />
            <figcaption className={`${styles.photoCap} hz-mono`}>
              <span>Bologna floor</span>
            </figcaption>
          </motion.figure>
        </div>

        <motion.div className={styles.foot} style={enabled ? { y: contentY, opacity: fade } : undefined}>
          {next && (
            <motion.div className={styles.next} style={{ x: metaX }}>
              <span className={`${styles.nextLabel} hz-mono`}>Next</span>
              <Link href={`/events/${next.slug}`} className={styles.nextTitle}>
                {next.title}
              </Link>
              <span className={`${styles.nextMeta} hz-mono`}>
                {next.date} · {next.venue} · {next.city}
              </span>
            </motion.div>
          )}

          <div className={styles.actions}>
            <Button href={ticketsHref}>Tickets</Button>
            <Button href="/events" variant="ghost">
              All events
            </Button>
          </div>
        </motion.div>

        <a href="#events" className={`${styles.scrollCue} hz-mono`} aria-label="Scroll to events">
          <span>Scroll</span>
          <motion.span
            className={styles.scrollDot}
            aria-hidden="true"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </a>
      </div>
    </section>
  )
}
