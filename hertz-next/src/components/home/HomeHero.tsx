'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SignatureTitle from '@/motion/SignatureTitle'
import Button from '@/components/ui/Button'
import { useEnableMotion } from '@/motion/useEnableMotion'
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
  const reduce = useReducedMotion()
  const enabled = useEnableMotion()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  useGSAP(
    () => {
      if (reduce) return
      gsap.to(`.${styles.waveInner}`, {
        scaleY: 1.35,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: 'center',
      })
      gsap.fromTo(
        `.${styles.wavePath}`,
        { strokeDashoffset: 1600 },
        { strokeDashoffset: 0, duration: 1.8, ease: 'power2.out', delay: 0.3 },
      )
    },
    { scope: root, dependencies: [reduce] },
  )

  const ticketsHref = next ? `/events/${next.slug}` : '/events'

  return (
    <section ref={root} data-surface="signal" className={styles.hero} id="top">
      <div className={styles.gridlines} aria-hidden="true" />

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
          <div className={styles.titleCol}>
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
              A minimal / deep-tech clubbing collective in Bologna — a resident night, a roster, an
              editorial, built around the selection and the floor.
            </motion.p>
          </div>

          <motion.figure
            className={styles.photoWrap}
            style={enabled ? { y: photoY } : undefined}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/hero-booth.jpg" alt="Hertz — the booth during an event" className={styles.photo} />
            <figcaption className={`${styles.photoCap} hz-mono`}>
              <span>N°{next?.n ?? '—'}</span>
              <span>Bologna floor</span>
            </figcaption>
          </motion.figure>

          <svg className={styles.wave} viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
            <g className={styles.waveInner}>
              <path
                className={styles.wavePath}
                d="M0,100 C160,100 210,100 320,100 C420,100 440,34 540,34 C640,34 660,166 760,166 C860,166 880,100 1000,100 C1140,100 1280,100 1440,100"
              />
              <path
                className={styles.wavePath2}
                d="M0,110 C180,110 230,110 340,110 C450,110 470,70 560,70 C650,70 680,150 780,150 C880,150 900,110 1020,110 C1160,110 1300,110 1440,110"
              />
            </g>
          </svg>
        </div>

        <motion.div className={styles.foot} style={enabled ? { y: contentY, opacity: fade } : undefined}>
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
