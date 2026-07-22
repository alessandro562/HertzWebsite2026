'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Button from '@/components/ui/Button'
import { useEnableMotion } from '@/motion/useEnableMotion'
import HeroSignalGrid from './HeroSignalGrid'
import type { NextEvent } from './HomeHero'
import styles from './HeroKinetic.module.css'

/**
 * Hero SOLO tipografia (nessuna foto). "CLUBBING COLLECTIVE" maiuscolo + logo
 * hertz che scorrono e giocano tra SOTTILE (thin 200) e GRASSETTO (bold 700).
 * Cinetica = drift orizzontale guidato dallo scroll (clippato dalla sezione).
 * Griglia Signal ambientale dietro. Reduced-motion: statico (drift gated via
 * useEnableMotion; MotionConfig azzera le entrate).
 */
export default function HeroKinetic({ next }: { next?: NextEvent }) {
  const root = useRef<HTMLElement>(null)
  const enabled = useEnableMotion()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })

  // drift cinetico: le due parole si allontanano in senso opposto scrollando
  const xClub = useTransform(scrollYProgress, [0, 1], ['0%', '-13%'])
  const xColl = useTransform(scrollYProgress, [0, 1], ['0%', '11%'])
  const xLogo = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  const ease = [0.16, 1, 0.3, 1] as const
  const ticketsHref = next ? `/events/${next.slug}` : '/events'

  return (
    <section ref={root} data-surface="signal" className={styles.hero} id="top">
      <HeroSignalGrid className={styles.grid} />

      <div className={styles.stage}>
        <motion.div
          className={styles.top}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="hz-mono">Bologna · since 2023</span>
          <span className="hz-mono">44.49° N / 11.34° E</span>
        </motion.div>

        <h1 className={styles.type} aria-label="Hertz — Clubbing Collective, Bologna">
          <motion.span
            className={`${styles.word} ${styles.clubbing}`}
            style={enabled ? { x: xClub } : undefined}
            initial={{ opacity: 0, y: '18%' }}
            animate={{ opacity: 1, y: '0%' }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            Clubbing
          </motion.span>
          <motion.span
            className={`${styles.word} ${styles.collective}`}
            style={enabled ? { x: xColl } : undefined}
            initial={{ opacity: 0, y: '18%' }}
            animate={{ opacity: 1, y: '0%' }}
            transition={{ duration: 0.9, delay: 0.22, ease }}
          >
            Collective
          </motion.span>

          <motion.div
            className={styles.logoLine}
            style={enabled ? { x: xLogo } : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <span className={styles.logo}>hertz</span>
            <span className={styles.logoTail}>— from clubbers, for clubbers</span>
          </motion.div>
        </h1>

        <motion.div className={styles.foot} style={enabled ? { opacity: fade } : undefined}>
          {next && (
            <div className={styles.next}>
              <span className={`${styles.nextLabel} hz-mono`}>Next · N°{next.n}</span>
              <Link href={`/events/${next.slug}`} className={styles.nextTitle}>
                {next.title}
              </Link>
              <span className={`${styles.nextMeta} hz-mono`}>
                {next.date} · {next.venue} · {next.city}
              </span>
            </div>
          )}
          <div className={styles.actions}>
            <Button href={ticketsHref}>{next?.onSale ? 'Tickets' : 'Next event'}</Button>
            <a href="#events" className={`${styles.scrollCue} hz-mono`} aria-label="Scroll to events">
              Scroll ↓
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
